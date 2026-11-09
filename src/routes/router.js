import railTripsRouter from './trips.js';
import { trainsApi, trainsPage } from './trains.js';
import { Router } from 'express';
import { homePage, aboutPage, testErrorPage } from './index.js';
import { getAllTrips, getTripById } from '../controllers/trips.js';
import swaggerUi from 'swagger-ui-express';
import openApiDocument from '../docs/openapi.js';

const router = Router();

// Home page
router.get('/', homePage);

// About page
router.get('/about', aboutPage);

// Trains page
router.get('/trains', trainsPage);

// Trains API
router.get('/api/trains', trainsApi);

// Trips API and interactive OpenAPI documentation.
router.get('/api/trips', getAllTrips);
router.get('/api/trips/:id', getTripById);
router.get('/api-docs.json', (req, res) => res.json(openApiDocument));
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

// Rail trips
router.use('/trips', railTripsRouter);

// Test 500 error page
router.get('/500', testErrorPage);

export default router;
