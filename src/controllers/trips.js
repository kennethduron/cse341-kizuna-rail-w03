import { getDb } from '../db/connect.js';
import {
  getAllTrips as findAllTrips,
  getTripById as findTripById
} from '../models/trips.js';

const tripIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function getAllTrips(req, res) {
  try {
    const trips = await findAllTrips();
    return res.status(200).json({ trips });
  } catch {
    console.error('Failed to retrieve trips.');
    return res.status(500).json({ error: 'Failed to fetch trips' });
  }
}

export async function getTripById(req, res) {
  const { id } = req.params;

  if (!tripIdPattern.test(id)) {
    return res.status(400).json({ error: 'Invalid trip id' });
  }

  try {
    const trip = await findTripById(id);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    return res.status(200).json(trip);
  } catch {
    console.error('Failed to retrieve trip.');
    return res.status(500).json({ error: 'Failed to fetch trip' });
  }
}

export const listTripsPage = (req, res) => res.render('trips/list', {
  title: 'Scenic Train Trips',
  selectedRegion: req.query.region || 'all',
  selectedSeason: req.query.season || 'all'
});

export async function tripDetailsPage(req, res, next) {
  try {
    const { tripId } = req.params;
    const trip = await findTripById(tripId);
    if (!trip) {
      return res.status(404).render('errors/404', { title: 'Trip Not Found' });
    }

    const schedules = await getDb().collection('schedules')
      .find({ tripId: trip.id })
      .toArray();

    return res.render('trips/details', {
      title: 'Trip Details',
      details: { ...trip, schedules }
    });
  } catch (error) {
    return next(error);
  }
}
