import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { updateWorkflowSchema } from '@/lib/validation/schemas';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/workflows/[id] - Get single workflow
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { userId } = await auth();
        const { id } = await params;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const workflow = await prisma.workflow.findFirst({
            where: {
                id,
                userId: user.id,
            },
        });

        if (!workflow) {
            return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
        }

        return NextResponse.json(workflow);
    } catch (error) {
        console.error('Failed to fetch workflow:', error);
        return NextResponse.json(
            { error: 'Failed to fetch workflow' },
            { status: 500 }
        );
    }
}

// PUT /api/workflows/[id] - Update workflow
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { userId } = await auth();
        const { id } = await params;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await request.json();
        const validation = updateWorkflowSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.flatten() },
                { status: 400 }
            );
        }

        // Check ownership
        const existingWorkflow = await prisma.workflow.findFirst({
            where: {
                id,
                userId: user.id,
            },
        });

        if (!existingWorkflow) {
            return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
        }

        const workflow = await prisma.workflow.update({
            where: { id },
            data: {
                ...(validation.data.name && { name: validation.data.name }),
                ...(validation.data.description !== undefined && { description: validation.data.description }),
                ...(validation.data.nodes && { nodes: validation.data.nodes as object }),
                ...(validation.data.edges && { edges: validation.data.edges as object }),
            },
        });

        return NextResponse.json(workflow);
    } catch (error) {
        console.error('Failed to update workflow:', error);
        return NextResponse.json(
            { error: 'Failed to update workflow' },
            { status: 500 }
        );
    }
}

// DELETE /api/workflows/[id] - Delete workflow
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { userId } = await auth();
        const { id } = await params;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check ownership
        const existingWorkflow = await prisma.workflow.findFirst({
            where: {
                id,
                userId: user.id,
            },
        });

        if (!existingWorkflow) {
            return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
        }

        await prisma.workflow.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete workflow:', error);
        return NextResponse.json(
            { error: 'Failed to delete workflow' },
            { status: 500 }
        );
    }
}
