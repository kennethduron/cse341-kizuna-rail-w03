import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';
import { closeDb, connectToDb, getDb } from '../src/db/connect.js';
import { initializeDatabase } from '../src/db/initialize.js';

const mongoServer = await MongoMemoryServer.create({
  instance: { launchTimeout: 60_000 }
});

await connectToDb({
  connectionString: mongoServer.getUri(),
  databaseName: 'kizuna-rail-demo'
});
await initializeDatabase(getDb());

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Kizuna Rail demo is running at http://localhost:${port}`);
  console.log('It uses an isolated, temporary MongoDB database with starter data.');
});

const shutdown = () => {
  server.close(async () => {
    await closeDb();
    await mongoServer.stop();
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
