import moment from "moment";
import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  providerService: { type: mongoose.Schema.Types.ObjectId, ref: "ProviderService", required: true },
  date: { type: Date, required: true },
  startTime: { type: Date, required: true },
  duration: { type: Number, required: true, default: 30 },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed", "cancelled"],
    default: "pending",
  },
  paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
  rating: {
    score: {
      type: Number,
      min: 0,
      max: 5, // Rating must be between 0 and 5
      default: null,
    },
    comment: { type: String, default: "" } // Optional field for user feedback
  },
}, { timestamps: true });

// Pre-save hook to format startTime
AppointmentSchema.pre('save', function (next) {
  if (this.startTime) {
    // Convert startTime to ISO format
    this.startTime = moment(this.startTime).toISOString();
  }
  next();
});

// Pre-update hook for startTime in update operations
AppointmentSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.startTime) {
    // Convert startTime to ISO format
    update.startTime = moment(update.startTime).toISOString();
    this.setUpdate(update);
  }
  next();
});


const Appointment = mongoose.model("Appointment", AppointmentSchema)
export default Appointment