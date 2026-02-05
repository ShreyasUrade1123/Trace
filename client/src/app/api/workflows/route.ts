import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createWorkflowSchema } from '@/lib/validation/schemas';

// GET /api/workflows - List all workflows for current user
export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get or create user
        let user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            const clerkUser = await currentUser();
            user = await prisma.user.create({
                data: {
                    clerkId: userId,
                    email: clerkUser?.emailAddresses[0]?.emailAddress,
                    name: clerkUser?.firstName,
                },
            });
        }

        const workflows = await prisma.workflow.findMany({
            where: { userId: user.id },
            orderBy: { updatedAt: 'desc' },
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: { runs: true },
                },
            },
        });

        return NextResponse.json({ workflows });
    } catch (error) {
        console.error('Failed to fetch workflows:', error);
        return NextResponse.json(
            { error: 'Failed to fetch workflows' },
            { status: 500 }
        );
    }
}

// POST /api/workflows - Create new workflow
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const validation = createWorkflowSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.flatten() },
                { status: 400 }
            );
        }

        // Get or create user
        let user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            const clerkUser = await currentUser();
            user = await prisma.user.create({
                data: {
                    clerkId: userId,
                    email: clerkUser?.emailAddresses[0]?.emailAddress,
                    name: clerkUser?.firstName,
                },
            });
        }

        const workflow = await prisma.workflow.create({
            data: {
                name: validation.data.name,
                description: validation.data.description,
                nodes: validation.data.nodes as object,
                edges: validation.data.edges as object,
                userId: user.id,
            },
        });

        return NextResponse.json(workflow, { status: 201 });
    } catch (error) {
        console.error('Failed to create workflow:', error);
        return NextResponse.json(
            { error: 'Failed to create workflow' },
            { status: 500 }
        );
    }
}
