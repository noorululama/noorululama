import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function POST(req: Request) {
    const isAuthenticated = await verifyAuth();
    if (!isAuthenticated) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    try {
        const { searchParams } = new URL(req.url);
        const filename = searchParams.get('filename') || `banner-${Date.now()}.png`;

        if (!req.body) {
            return NextResponse.json({ success: false, error: 'No body' }, { status: 400 });
        }

        const blob = await put(filename, req.body, {
            access: 'public',
        });

        return NextResponse.json({ success: true, url: blob.url });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
    }
}
