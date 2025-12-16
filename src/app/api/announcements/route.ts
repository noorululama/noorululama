
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

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const showAll = searchParams.get('all') === 'true';

        const announcements = await getAnnouncements();
        // Sort by priority (desc) and date (desc)
        let filtered = announcements
            .sort((a: any, b: any) => b.priority - a.priority || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        if (!showAll) {
            filtered = filtered.filter((a: any) => a.isActive);
        }

        return NextResponse.json({ success: true, data: filtered });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch announcements' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const isAuthenticated = await verifyAuth();
    if (!isAuthenticated) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const announcements = await getAnnouncements();

        const newAnnouncement = {
            ...body,
            _id: Date.now().toString(),
            isActive: true,
            createdAt: new Date().toISOString(),
        };

        announcements.push(newAnnouncement);
        await saveAnnouncements(announcements);

        return NextResponse.json({ success: true, data: newAnnouncement }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create announcement' }, { status: 400 });
    }
}
