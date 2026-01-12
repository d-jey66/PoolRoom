import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user: {
    type: String,
    required: true
  },
  tableNumber: {
    type: Number,
    required: true
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  tableType: {
    type: String,
    enum: ['normal', 'coupe'],
    required: true
  },
  price: {
    type: Number,
    required: true
  }
}, { timestamps: true });

ReservationSchema.index({ tableNumber: 1, start: 1, end: 1 });


const Reservation = mongoose.model('Reservation', ReservationSchema);
export default Reservation;
