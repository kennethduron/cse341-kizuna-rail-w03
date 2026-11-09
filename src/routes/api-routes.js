import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { getAllTrips, getTripById } from '../controllers/trips.js';
import openApiDocument from '../docs/openapi.js';
import { trainsApi } from './trains.js';

const router = Router();

// Existing Trains API remains available alongside the new Trips endpoints.
router.get('/api/trains', trainsApi);
router.get('/api/trips', getAllTrips);
router.get('/api/trips/:id', getTripById);

router.get('/api-docs.json', (req, res) => res.json(openApiDocument));
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

export default router;
