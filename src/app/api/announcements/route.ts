
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import { Announcement } from '@/lib/models';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const showAll = searchParams.get('all') === 'true';

        // Sort by priority (desc) and date (desc)
        let query = showAll ? {} : { isActive: true };
        const announcements = await Announcement.find(query)
            .sort({ priority: -1, createdAt: -1 });

        return NextResponse.json({ success: true, data: announcements });
    } catch (error) {
        console.error('Error fetching announcements:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch announcements' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const isAuthenticated = await verifyAuth();
    if (!isAuthenticated) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const body = await req.json();

        const newAnnouncement = await Announcement.create({
            ...body,
            isActive: true,
            createdAt: new Date(),
        });

        return NextResponse.json({ success: true, data: newAnnouncement }, { status: 201 });
    } catch (error) {
        console.error('Error creating announcement:', error);
        return NextResponse.json({ success: false, error: 'Failed to create announcement' }, { status: 400 });
    }
}
