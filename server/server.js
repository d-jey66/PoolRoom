import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import rateLimiter from 'express-rate-limit';
import helmet from 'helmet';
import authRouter from './routers/auth.router.js';
import globalErrorHandler from './controllers/error.controller.js';
import reservationRouter from './routers/reservation.router.js';
import { updateReservationStatuses } from './controllers/reservation.controller.js';
import userRouter from './routers/user.router.js';
import paymentRouter from "./routes/payment.router.js";

dotenv.config();

const app = express();

app.set('trust proxy', 1);

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));

setInterval(updateReservationStatuses, 60000);

app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100
}));
app.use(helmet());

app.use(cookieParser());
app.use(express.json());

app.get('/api/status', (req, res) => {
    res.json({ status: 'Server is running' });
});

app.use('/api/auth', authRouter);
app.use('/api/reservations', reservationRouter);
app.use('/api/users', userRouter);
app.use("/api/payments", paymentRouter);

app.use(globalErrorHandler);

mongoose.connect(process.env.DB)
    .then(() => {
        updateReservationStatuses();
        console.log('Connected to MongoDB');
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch(err => console.error('MongoDB connection error:', err));
