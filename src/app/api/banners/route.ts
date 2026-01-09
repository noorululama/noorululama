
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import { Banner } from '@/lib/models';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const showAll = searchParams.get('all') === 'true';

        let query = showAll ? {} : { isActive: true };
        const banners = await Banner.find(query).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: banners });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const isAuthenticated = await verifyAuth();
    if (!isAuthenticated) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    try {
        await dbConnect();
        const body = await req.json();

        const newBanner = await Banner.create({
            ...body,
            isActive: true,
            createdAt: new Date(),
        });

        return NextResponse.json({ success: true, data: newBanner }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed' }, { status: 400 });
    }
}
