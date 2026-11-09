import { afterEach, describe, expect, test, vi } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import { getMongooseConnection } from '../src/db/connect.js';
import * as tripsModel from '../src/models/trips.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Trips Mongoose model and API', () => {
  test('returns all six starter trips as JSON', async () => {
    const response = await request(app).get('/api/trips');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.body.trips).toHaveLength(6);
    expect(response.body.trips).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'alpine-panorama', name: 'Alpine Panorama Express' })
    ]));
  });

  test('loads a trip by its existing custom string ID', async () => {
    const response = await request(app).get('/api/trips/alpine-panorama');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 'alpine-panorama',
      startStation: 'nagoya',
      endStation: 'toyama'
    });
  });

  test('returns 400 for an ID outside the starter slug format', async () => {
    const response = await request(app).get('/api/trips/Invalid%20ID');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid trip id' });
  });

  test('returns 404 for a valid slug that does not exist', async () => {
    const response = await request(app).get('/api/trips/no-such-trip');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Trip not found' });
  });

  test('returns a safe 500 when the list query fails', async () => {
    vi.spyOn(tripsModel, 'getAllTrips').mockRejectedValue(new Error('private database details'));

    const response = await request(app).get('/api/trips');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to fetch trips' });
    expect(JSON.stringify(response.body)).not.toContain('private database details');
  });

  test('returns a safe 500 when the detail query fails', async () => {
    vi.spyOn(tripsModel, 'getTripById').mockRejectedValue(new Error('private database details'));

    const response = await request(app).get('/api/trips/alpine-panorama');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to fetch trip' });
    expect(JSON.stringify(response.body)).not.toContain('private database details');
  });

  test('validates required fields and custom slug IDs in the Mongoose schema', async () => {
    await tripsModel.getTripById('alpine-panorama');
    const Trip = getMongooseConnection().model('Trip');
    const invalidTrip = new Trip({ id: 'Invalid ID' });
    let validationError;
    try {
      await invalidTrip.validate();
    } catch (error) {
      validationError = error;
    }

    expect(validationError).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(validationError.errors.id).toBeDefined();
    expect(validationError.errors.name).toBeDefined();
    expect(validationError.errors.operatingMonths).toBeDefined();
  });
});

describe('Trips EJS pages and OpenAPI documentation', () => {
  test('renders the list shell without server-side trip cards', async () => {
    const response = await request(app).get('/trips');

    expect(response.status).toBe(200);
    expect(response.text).toContain('id="trips-list"');
    expect(response.text).toContain('id="trips-loading"');
    expect(response.text).toContain('id="trips-empty"');
    expect(response.text).not.toContain('Alpine Panorama Express');
  });

  test('renders details and preserves schedules for a trip', async () => {
    const response = await request(app).get('/trips/alpine-panorama');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Alpine Panorama Express');
    expect(response.text).toContain('08:30');
    expect(response.text).toContain('/trips/booking/1');
  });

  test('returns an HTML 404 for an unknown trip detail route', async () => {
    const response = await request(app).get('/trips/no-such-trip');

    expect(response.status).toBe(404);
    expect(response.text).toContain('Page Not Found');
  });

  test('serves interactive Swagger UI and the OpenAPI JSON document', async () => {
    const uiResponse = await request(app).get('/api-docs/');
    const specResponse = await request(app).get('/api-docs.json');

    expect(uiResponse.status).toBe(200);
    expect(uiResponse.text).toContain('swagger-ui');
    expect(specResponse.status).toBe(200);
    expect(specResponse.body.paths['/api/trips/{id}'].get.responses['404']).toBeDefined();
  });
});
