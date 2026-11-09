import mongoose from 'mongoose';

let connection;

const connectToDb = async (options = {}) => {
  if (connection?.readyState === 1) {
    return connection.db;
  }

  const connectionString = options.connectionString || process.env.MONGODB_URI;
  const databaseName = options.databaseName || process.env.MONGODB_DB_NAME || 'practice';

  if (!connectionString) {
    throw new Error('MONGODB_URI is required.');
  }

  connection = mongoose.createConnection(connectionString, {
    dbName: databaseName
  });
  await connection.asPromise();
  return connection.db;
};

const getDb = () => {
  if (!connection?.db) {
    throw new Error('Database not initialized. Call connectToDb first.');
  }
  return connection.db;
};

const getMongooseConnection = () => {
  if (connection?.readyState !== 1) {
    throw new Error('Database not initialized. Call connectToDb first.');
  }
  return connection;
};

const closeDb = async () => {
  if (connection) {
    await connection.close();
    connection = undefined;
  }
};

export { closeDb, connectToDb, getDb, getMongooseConnection };
