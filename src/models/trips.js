import { getMongooseConnection } from '../db/connect.js';
import tripSchema from './schemas/trips.js';

const getTripModel = () => {
  const connection = getMongooseConnection();
  return connection.models.Trip || connection.model('Trip', tripSchema, 'trips');
};

export async function getTripById(id) {
  return getTripModel().findOne({ id }).lean();
}

export async function getAllTrips() {
  return getTripModel().find({}).sort({ name: 1 }).lean();
}
