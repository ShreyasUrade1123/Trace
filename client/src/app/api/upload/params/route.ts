import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const TRANSLOADIT_AUTH_KEY = process.env.NEXT_PUBLIC_TRANSLOADIT_AUTH_KEY!;
const TRANSLOADIT_AUTH_SECRET = process.env.TRANSLOADIT_AUTH_SECRET!;

interface TransloaditParams {
    auth: {
        key: string;
        expires: string;
    };
    steps: Record<string, unknown>;
}

function generateSignature(params: TransloaditParams): string {
    const toSign = JSON.stringify(params);
    const signature = crypto
        .createHmac('sha384', TRANSLOADIT_AUTH_SECRET)
        .update(toSign)
        .digest('hex');
    return `sha384:${signature}`;
}

function getExpiryDate(): string {
    const date = new Date();
    date.setHours(date.getHours() + 1);
    return date.toISOString().replace(/\.\d{3}Z$/, '+00:00');
}

export async function POST(request: NextRequest) {
    try {
        const { type = 'image' } = await request.json();

        const params: TransloaditParams = {
            auth: {
                key: TRANSLOADIT_AUTH_KEY,
                expires: getExpiryDate(),
            },
            steps:
                type === 'video'
                    ? {
                        ':original': { robot: '/upload/handle' },
                    }
                    : {
                        ':original': { robot: '/upload/handle' },
                        optimized: {
                            robot: '/image/optimize',
                            use: ':original',
                            progressive: true,
                        },
                    },
        };

        const signature = generateSignature(params);

        return NextResponse.json({
            params: JSON.stringify(params),
            signature,
            authKey: TRANSLOADIT_AUTH_KEY,
        });
    } catch (error) {
        console.error('Transloadit signature error:', error);
        return NextResponse.json(
            { error: 'Failed to generate upload params' },
            { status: 500 }
        );
    }
}
