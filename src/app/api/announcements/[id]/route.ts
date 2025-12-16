
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src/data/announcements.json');

async function getAnnouncements() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function saveAnnouncements(announcements: any[]) {
    await fs.writeFile(DATA_FILE, JSON.stringify(announcements, null, 2));
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const isAuthenticated = await verifyAuth();
    if (!isAuthenticated) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        const announcements = await getAnnouncements();
        const filtered = announcements.filter((a: any) => a._id !== id);

        if (announcements.length === filtered.length) {
            return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
        }

        await saveAnnouncements(filtered);
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 400 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const isAuthenticated = await verifyAuth();
    if (!isAuthenticated) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        const body = await req.json();
        const announcements = await getAnnouncements();
        const index = announcements.findIndex((a: any) => a._id === id);

        if (index === -1) {
            return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
        }

        // Update the fields provided in body
        announcements[index] = { ...announcements[index], ...body };

        await saveAnnouncements(announcements);

        return NextResponse.json({ success: true, data: announcements[index] });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 400 });
    }
}
