import { afterEach, describe, expect, test, vi } from 'vitest';

const modelMocks = vi.hoisted(() => ({
  getAllTrips: vi.fn(),
  getTripById: vi.fn()
}));

vi.mock('../src/models/trips.js', () => modelMocks);

import { getAllTrips, getTripById, listTripsPage } from '../src/controllers/trips.js';

const createResponse = () => {
  const response = {
    statusCode: undefined,
    body: undefined,
    view: undefined,
    locals: undefined,
    status: vi.fn(),
    json: vi.fn(),
    render: vi.fn()
  };
  response.status.mockImplementation((statusCode) => {
    response.statusCode = statusCode;
    return response;
  });
  response.json.mockImplementation((body) => {
    response.body = body;
    return response;
  });
  response.render.mockImplementation((view, locals) => {
    response.view = view;
    response.locals = locals;
    return response;
  });
  return response;
};

afterEach(() => {
  vi.clearAllMocks();
});

describe('Trips API controller unit tests', () => {
  test('returns the list in the established trips JSON envelope', async () => {
    modelMocks.getAllTrips.mockResolvedValue([{ id: 'alpine-panorama' }]);
    const response = createResponse();

    await getAllTrips({}, response);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ trips: [{ id: 'alpine-panorama' }] });
  });

  test('returns a trip for a valid custom ID', async () => {
    modelMocks.getTripById.mockResolvedValue({ id: 'alpine-panorama' });
    const response = createResponse();

    await getTripById({ params: { id: 'alpine-panorama' } }, response);

    expect(modelMocks.getTripById).toHaveBeenCalledWith('alpine-panorama');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: 'alpine-panorama' });
  });

  test('rejects IDs outside the verified slug format before querying', async () => {
    const response = createResponse();

    await getTripById({ params: { id: 'Invalid ID' } }, response);

    expect(modelMocks.getTripById).not.toHaveBeenCalled();
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid trip id' });
  });

  test('returns 404 when a valid ID does not exist', async () => {
    modelMocks.getTripById.mockResolvedValue(null);
    const response = createResponse();

    await getTripById({ params: { id: 'missing-trip' } }, response);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ error: 'Trip not found' });
  });

  test('uses generic errors for unexpected model failures', async () => {
    modelMocks.getAllTrips.mockRejectedValue(new Error('database URI must not be returned'));
    const response = createResponse();

    await getAllTrips({}, response);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to fetch trips' });
    expect(JSON.stringify(response.body)).not.toContain('database URI');
  });

  test('renders only the Trips page shell with query filter values', () => {
    const response = createResponse();

    listTripsPage({ query: { region: 'central', season: 'autumn' } }, response);

    expect(response.view).toBe('trips/list');
    expect(response.locals).toMatchObject({
      selectedRegion: 'central',
      selectedSeason: 'autumn'
    });
    expect(response.locals).not.toHaveProperty('trips');
  });
});
