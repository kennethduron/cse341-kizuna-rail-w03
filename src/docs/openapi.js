const tripSchema = {
  type: 'object',
  required: [
    'id', 'name', 'description', 'region', 'startStation', 'endStation',
    'duration', 'distance', 'highlights', 'bestSeason', 'operatingMonths'
  ],
  properties: {
    id: { type: 'string', example: 'alpine-panorama' },
    name: { type: 'string', example: 'Alpine Panorama Express' },
    description: { type: 'string' },
    region: { type: 'string', example: 'central' },
    startStation: { type: 'string', example: 'nagoya' },
    endStation: { type: 'string', example: 'toyama' },
    duration: { type: 'string', example: '4.5 hours' },
    distance: { type: 'number', example: 180 },
    highlights: { type: 'array', items: { type: 'string' } },
    bestSeason: { type: 'string', example: 'autumn' },
    operatingMonths: {
      type: 'array',
      items: { type: 'integer', minimum: 1, maximum: 12 }
    },
    imageUrl: { type: 'string', example: '/images/routes/alpine-panorama.png' }
  }
};

const errorSchema = {
  type: 'object',
  required: ['error'],
  properties: { error: { type: 'string' } }
};

const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Kizuna Rail API',
    version: '1.0.0',
    description: 'Read-only API for scenic railway trips.'
  },
  servers: [{ url: '/' }],
  paths: {
    '/api/trips': {
      get: {
        summary: 'List all trips',
        operationId: 'getAllTrips',
        responses: {
          200: {
            description: 'Trips returned successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['trips'],
                  properties: {
                    trips: { type: 'array', items: { $ref: '#/components/schemas/Trip' } }
                  }
                },
                example: {
                  trips: [{
                    id: 'alpine-panorama',
                    name: 'Alpine Panorama Express',
                    description: 'Journey through the Japanese Alps.',
                    region: 'central',
                    startStation: 'nagoya',
                    endStation: 'toyama',
                    duration: '4.5 hours',
                    distance: 180,
                    highlights: ['Mountain views'],
                    bestSeason: 'autumn',
                    operatingMonths: [4, 5, 6, 7, 8, 9, 10, 11],
                    imageUrl: '/images/routes/alpine-panorama.png'
                  }]
                }
              }
            }
          },
          500: {
            description: 'Unexpected server error.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
          }
        }
      }
    },
    '/api/trips/{id}': {
      get: {
        summary: 'Get one trip by its custom string ID',
        operationId: 'getTripById',
        parameters: [{
          name: 'id',
          in: 'path',
          required: true,
          description: 'Lowercase slug used by the starter trip data.',
          schema: { type: 'string', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' },
          example: 'alpine-panorama'
        }],
        responses: {
          200: {
            description: 'Trip returned successfully.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Trip' } } }
          },
          400: {
            description: 'Trip ID is not a valid lowercase slug.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
          },
          404: {
            description: 'No trip exists with the supplied ID.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
          },
          500: {
            description: 'Unexpected server error.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
          }
        }
      }
    }
  },
  components: { schemas: { Trip: tripSchema, Error: errorSchema } }
};

export default openApiDocument;
