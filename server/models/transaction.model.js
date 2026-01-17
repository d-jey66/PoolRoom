import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    reservationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    tableNumber: {
      type: Number,
      required: true,
    },
    tableType: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['online', 'at_venue'],
      required: true,
    },
    status: {
      type: String,
      enum: ['completed', 'refunded'],
      default: 'completed',
    },
    transactionDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;