/**
 * Transloadit API Client
 * 
 * Uses the Transloadit REST API for file processing without external SDK.
 * Supports:
 * - Image uploads and optimization
 * - Video thumbnails/frame extraction
 * - Image cropping
 */

import crypto from 'crypto';

const TRANSLOADIT_AUTH_KEY = process.env.NEXT_PUBLIC_TRANSLOADIT_AUTH_KEY!;
const TRANSLOADIT_AUTH_SECRET = process.env.TRANSLOADIT_AUTH_SECRET!;

interface TransloaditParams {
    auth: {
        key: string;
        expires: string;
    };
    steps: Record<string, unknown>;
    template_id?: string;
}

interface TransloaditResult {
    ok: string;
    assembly_id: string;
    assembly_ssl_url: string;
    assembly_url: string;
    results: Record<string, Array<{
        id: string;
        name: string;
        basename: string;
        ext: string;
        size: number;
        mime: string;
        type: string;
        field: string;
        url: string;
        ssl_url: string;
        meta: Record<string, unknown>;
    }>>;
    error?: string;
    message?: string;
}

/**
 * Generate signature for Transloadit API
 */
function generateSignature(params: TransloaditParams): string {
    const toSign = JSON.stringify(params);
    const signature = crypto
        .createHmac('sha384', TRANSLOADIT_AUTH_SECRET)
        .update(toSign)
        .digest('hex');
    return `sha384:${signature}`;
}

/**
 * Generate expiry date (1 hour from now)
 */
function getExpiryDate(): string {
    const date = new Date();
    date.setHours(date.getHours() + 1);
    return date.toISOString().replace(/\.\d{3}Z$/, '+00:00');
}

/**
 * Create assembly params for image upload and optimization
 */
export function createImageUploadParams(): { params: TransloaditParams; signature: string } {
    const params: TransloaditParams = {
        auth: {
            key: TRANSLOADIT_AUTH_KEY,
            expires: getExpiryDate(),
        },
        steps: {
            ':original': {
                robot: '/upload/handle',
            },
            optimized: {
                robot: '/image/optimize',
                use: ':original',
                progressive: true,
                preserve_meta_data: false,
            },
            stored: {
                robot: '/s3/store',
                use: 'optimized',
                credentials: 'transloadit_default',
                path: 'uploads/images/${unique_prefix}/${file.url_name}',
            },
        },
    };

    return {
        params,
        signature: generateSignature(params),
    };
}

/**
 * Create assembly params for video frame extraction
 */
export function createVideoFrameParams(timestamp: number = 0): { params: TransloaditParams; signature: string } {
    const params: TransloaditParams = {
        auth: {
            key: TRANSLOADIT_AUTH_KEY,
            expires: getExpiryDate(),
        },
        steps: {
            ':original': {
                robot: '/upload/handle',
            },
            thumbnail: {
                robot: '/video/thumbs',
                use: ':original',
                offsets: [timestamp],
                width: 1280,
                height: 720,
                resize_strategy: 'fit',
                format: 'png',
            },
            stored: {
                robot: '/s3/store',
                use: 'thumbnail',
                credentials: 'transloadit_default',
                path: 'uploads/frames/${unique_prefix}/${file.url_name}',
            },
        },
    };

    return {
        params,
        signature: generateSignature(params),
    };
}

/**
 * Create assembly params for image cropping
 */
export function createImageCropParams(
    x: number,
    y: number,
    width: number,
    height: number
): { params: TransloaditParams; signature: string } {
    const params: TransloaditParams = {
        auth: {
            key: TRANSLOADIT_AUTH_KEY,
            expires: getExpiryDate(),
        },
        steps: {
            ':original': {
                robot: '/upload/handle',
            },
            cropped: {
                robot: '/image/resize',
                use: ':original',
                crop: {
                    x1: x,
                    y1: y,
                    x2: x + width,
                    y2: y + height,
                },
                resize_strategy: 'crop',
            },
            stored: {
                robot: '/s3/store',
                use: 'cropped',
                credentials: 'transloadit_default',
                path: 'uploads/cropped/${unique_prefix}/${file.url_name}',
            },
        },
    };

    return {
        params,
        signature: generateSignature(params),
    };
}

/**
 * Create an assembly and upload a file
 */
export async function createAssembly(
    file: File | Blob,
    steps: Record<string, unknown>
): Promise<TransloaditResult> {
    const params: TransloaditParams = {
        auth: {
            key: TRANSLOADIT_AUTH_KEY,
            expires: getExpiryDate(),
        },
        steps,
    };

    const signature = generateSignature(params);

    const formData = new FormData();
    formData.append('params', JSON.stringify(params));
    formData.append('signature', signature);
    formData.append('file', file);

    const response = await fetch('https://api2.transloadit.com/assemblies', {
        method: 'POST',
        body: formData,
    });

    const result = await response.json();

    if (result.error) {
        throw new Error(`Transloadit error: ${result.error} - ${result.message}`);
    }

    return result;
}

/**
 * Wait for assembly to complete
 */
export async function waitForAssembly(assemblyUrl: string, maxWait = 60000): Promise<TransloaditResult> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWait) {
        const response = await fetch(assemblyUrl);
        const result = await response.json();

        if (result.ok === 'ASSEMBLY_COMPLETED') {
            return result;
        }

        if (result.error) {
            throw new Error(`Transloadit error: ${result.error} - ${result.message}`);
        }

        // Wait 1 second before polling again
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    throw new Error('Assembly timeout');
}

/**
 * Upload an image and get the optimized URL
 */
export async function uploadImage(file: File | Blob): Promise<string> {
    const steps = {
        ':original': {
            robot: '/upload/handle',
        },
        optimized: {
            robot: '/image/optimize',
            use: ':original',
            progressive: true,
        },
    };

    const assembly = await createAssembly(file, steps);
    const completed = await waitForAssembly(assembly.assembly_ssl_url);

    if (completed.results.optimized && completed.results.optimized.length > 0) {
        return completed.results.optimized[0].ssl_url;
    }

    if (completed.results[':original'] && completed.results[':original'].length > 0) {
        return completed.results[':original'][0].ssl_url;
    }

    throw new Error('No results from Transloadit');
}

/**
 * Extract a frame from a video
 */
export async function extractVideoFrame(file: File | Blob, timestampSeconds: number = 0): Promise<string> {
    const steps = {
        ':original': {
            robot: '/upload/handle',
        },
        thumbnail: {
            robot: '/video/thumbs',
            use: ':original',
            offsets: [timestampSeconds],
            width: 1280,
            height: 720,
            resize_strategy: 'fit',
            format: 'png',
        },
    };

    const assembly = await createAssembly(file, steps);
    const completed = await waitForAssembly(assembly.assembly_ssl_url);

    if (completed.results.thumbnail && completed.results.thumbnail.length > 0) {
        return completed.results.thumbnail[0].ssl_url;
    }

    throw new Error('Failed to extract video frame');
}

/**
 * Crop an image
 */
export async function cropImage(
    file: File | Blob,
    x: number,
    y: number,
    width: number,
    height: number
): Promise<string> {
    const steps = {
        ':original': {
            robot: '/upload/handle',
        },
        cropped: {
            robot: '/image/resize',
            use: ':original',
            crop: {
                x1: x,
                y1: y,
                x2: x + width,
                y2: y + height,
            },
            resize_strategy: 'crop',
        },
    };

    const assembly = await createAssembly(file, steps);
    const completed = await waitForAssembly(assembly.assembly_ssl_url);

    if (completed.results.cropped && completed.results.cropped.length > 0) {
        return completed.results.cropped[0].ssl_url;
    }

    throw new Error('Failed to crop image');
}

/**
 * Get Transloadit params for client-side upload
 * Returns params and signature for use with Uppy or direct form upload
 */
export function getClientUploadParams(
    type: 'image' | 'video' = 'image'
): { params: string; signature: string } {
    const paramsData: TransloaditParams = {
        auth: {
            key: TRANSLOADIT_AUTH_KEY,
            expires: getExpiryDate(),
        },
        steps:
            type === 'image'
                ? {
                    ':original': { robot: '/upload/handle' },
                    optimized: { robot: '/image/optimize', use: ':original', progressive: true },
                }
                : {
                    ':original': { robot: '/upload/handle' },
                },
    };

    return {
        params: JSON.stringify(paramsData),
        signature: generateSignature(paramsData),
    };
}
