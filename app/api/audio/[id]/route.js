import { NextResponse } from 'next/server';
import { connectToGridFS, closeGridFSConnection } from '../../../../utils/gridfs';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  const id = params.id;

  try {
    const bucket = await connectToGridFS();
    const downloadStream = bucket.openDownloadStream(new ObjectId(id));

    const chunks = [];
    for await (const chunk of downloadStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('Error serving audio:', error);
    return NextResponse.json({ error: 'Failed to serve audio' }, { status: 500 });
  } finally {
    await closeGridFSConnection();
  }
}