import { Router } from 'express';
import protect from '../middlewares/auth.middleware.js';
import allowedTo from '../middlewares/roles.middleware.js';
import { createReservation, getReservations, getMyReservations, updateReservationStatus, deleteReservation } from '../controllers/reservation.controller.js';

const reservationRouter = Router();

reservationRouter.get('/get', protect, allowedTo('admin'), getReservations);

reservationRouter.post('/post', protect, createReservation); 
reservationRouter.get('/my-reservations', protect, getMyReservations); 
reservationRouter.put('/update/:id', protect, updateReservationStatus); 
reservationRouter.delete('/delete/:id', protect, deleteReservation);

export default reservationRouter;
