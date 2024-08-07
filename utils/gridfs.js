import { MongoClient, GridFSBucket } from 'mongodb';

let client;
let gridFSBucket;

export async function connectToGridFS() {
  if (gridFSBucket) {
    return gridFSBucket;
  }

  const uri = process.env.DATABASE_URL;  // Changed from MONGODB_URI to DATABASE_URL
  if (!uri) {
    throw new Error('DATABASE_URL is not defined in the environment variables');
  }

  client = new MongoClient(uri);
  await client.connect();

  const db = client.db();
  gridFSBucket = new GridFSBucket(db);

  return gridFSBucket;
}

export async function closeGridFSConnection() {
  if (client) {
    await client.close();
    client = null;
    gridFSBucket = null;
  }
}