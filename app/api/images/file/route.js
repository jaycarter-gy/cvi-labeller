
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const imagePath = searchParams.get('path');

  if (!imagePath) {
    return NextResponse.json({ error: 'Image path is required.' }, { status: 400 });
  }

  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const headers = new Headers();
    headers.set('Content-Type', `image/${path.extname(imagePath).slice(1)}`);
    return new NextResponse(imageBuffer, { status: 200, statusText: 'OK', headers });
  } catch (error) {
    return NextResponse.json({ error: 'Image not found.' }, { status: 404 });
  }
}
