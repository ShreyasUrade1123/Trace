import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/workflows/[id]/runs - Get workflow runs
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

        const runs = await prisma.workflowRun.findMany({
            where: {
                workflowId: id,
                userId: user.id,
            },
            orderBy: { startedAt: 'desc' },
            take: 50,
            include: {
                nodeResults: {
                    orderBy: { startedAt: 'asc' },
                },
            },
        });

        return NextResponse.json({ runs });
    } catch (error) {
        console.error('Failed to fetch runs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch runs' },
            { status: 500 }
        );
    }
}
