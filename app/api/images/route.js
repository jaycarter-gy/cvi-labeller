
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const getAllFiles = (dirPath, arrayOfFiles) => {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
};


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const dir = searchParams.get('dir');

  if (!dir) {
    return NextResponse.json({ error: 'Directory path is required.' }, { status: 400 });
  }

  try {
    const allFiles = getAllFiles(dir);
    const images = allFiles
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.png', '.jpg', '.jpeg', '.gif', '.bmp'].includes(ext);
      })
      .map(file => ({
        src: `/api/images/file?path=${encodeURIComponent(file)}`,
        name: path.relative(dir, file),
        path: file
      }));
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read directory.', details: error.message }, { status: 500 });
  }
}
