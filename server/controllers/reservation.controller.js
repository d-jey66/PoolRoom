import Reservation from "../models/reservation.model.js";
import User from "../models/user.model.js";
import sendEmail from "../utils/email.js";


// create resrvation

export const createReservation = async (req, res) => {
  try {
    const { userId, user, tableNumber, date, startTime, duration } = req.body;
    
    if (!userId || !user || !tableNumber || !date || !startTime || !duration) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const allowed = [1, 2, 3, 4];
    if (!allowed.includes(Number(duration))) {
      return res.status(400).json({ message: "Duration must be 1, 2, 3 or 4 hours" });
    }
    
    const start = new Date(`${date}T${startTime}:00`);
    if (isNaN(start)) return res.status(400).json({ message: "Invalid date or time format" });
    
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);
    
    const conflict = await Reservation.findOne({
      tableNumber,
      start: { $lt: end },
      end: { $gt: start }
    });
    
    if (conflict) {
      return res.status(409).json({ message: "This time slot is already booked" });
    }
    
    const reservation = await Reservation.create({ 
      userId,
      user, 
      tableNumber, 
      start, 
      end 
    });

    
    res.status(201).json({ success: true, reservation });
    
    const userDoc = await User.findById(userId);
    if (userDoc && userDoc.email) {
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      const startFormatted = start.toLocaleDateString('en-US', options);
      const endTime = end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .detail-row { margin: 10px 0; }
            .label { font-weight: bold; color: #667eea; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎱 Reservation Confirmed!</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${user}</strong>,</p>
              <p>Your reservation at <strong>Pool Room</strong> has been confirmed! We're excited to have you play at our bar and enjoy a drink with us. We look forward to seeing you soon!</p>
              
              <div class="details">
                <h2 style="margin-top: 0; color: #667eea;">Reservation Details</h2>
                <div class="detail-row">
                  <span class="label">Name:</span> ${user}
                </div>
                <div class="detail-row">
                  <span class="label">Table Number:</span> ${tableNumber}
                </div>
                <div class="detail-row">
                  <span class="label">Date & Time:</span> ${startFormatted}
                </div>
                <div class="detail-row">
                  <span class="label">Duration:</span> ${duration} hour${duration > 1 ? 's' : ''}
                </div>
                <div class="detail-row">
                  <span class="label">End Time:</span> ${endTime}
                </div>
              </div>

              <p style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
                <strong>⏰ Please arrive on time!</strong><br>
                We're looking forward to seeing you play at our bar. If you need to cancel or modify your reservation, please contact us as soon as possible.
              </p>

              <div class="footer">
                <p>See you soon at Pool Room! 🎱</p>
                <p style="font-size: 12px; color: #999;">This is an automated confirmation email.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      console.log('Attempting to send email to:', userDoc.email);
      
      await sendEmail({
        to: userDoc.email,
        subject: `🎱 Reservation Confirmed - ${user} at Pool Room`,
        html: emailHtml
      }).then(() => {
        console.log('Email sent successfully to:', userDoc.email);
      }).catch(err => {
        console.error('Email failed:', err);
        console.error('Email error details:', err.message);
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// get every reservation

export const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation
      .find()
      .populate("userId", "fullname email")
      .sort({ createdAt: -1 });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reservations",
      error: error.message
    });
  }
};



// get only users reservations

export const getMyReservations= async (req, res) => {
  try {
    const reservations = await Reservation
      .find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reservations",
      error: error.message
    });
  }
};



// update reservation

export const updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.json(reservation);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update status",
      error: error.message
    });
  }
};



// delete reservation

export const deleteReservation = async (req, res) => {
  try {
    const deleted = await Reservation.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.json({ message: "Reservation deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete reservation",
      error: error.message
    });
  }
};

export const updateReservationStatuses = async () => {
  const now = new Date();
  
  try {
    await Reservation.updateMany(
      { 
        start: { $lte: now },
        end: { $gt: now },
        status: 'pending'
      },
      { status: 'active' }
    );
    
    const completedReservations = await Reservation.find({
      end: { $lte: now },
      status: { $in: ['pending', 'active'] }
    });
    
    await Reservation.deleteMany({
      end: { $lte: now },
      status: { $in: ['pending', 'active'] }
    });
    

  } catch (error) {
    console.error('Error updating reservation statuses:', error);
  }
};