import { NextResponse } from 'next/server';
import { connectToGridFS, closeGridFSConnection } from '../../../utils/gridfs';

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('audio');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const bucket = await connectToGridFS();

    const uploadStream = bucket.openUploadStream(file.name, {
      contentType: file.type
    });

    await new Promise((resolve, reject) => {
      uploadStream.end(buffer, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    const fileId = uploadStream.id.toString();
    return NextResponse.json({ url: fileId });
  } catch (error) {
    console.error('Error uploading audio:', error);
    return NextResponse.json({ error: 'Failed to upload audio' }, { status: 500 });
  } finally {
    await closeGridFSConnection();
  }
}