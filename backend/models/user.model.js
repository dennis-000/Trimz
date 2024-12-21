import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: {
    type: String,
    enum: ["customer", "provider", "admin", "superadmin"], // Added "superadmin"
    default: "customer",
  },
  gender: { type: String, },
  googleId: { type: String },
  phone: { type: String },
  profilePicture: {
    url: { type: String },
    public_id: { type: String }
  },
  gallery: [
    {
        url: { type: String },
        public_id: { type: String },
    },
  ],
  // Only for providers
  servicesOffered: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }], // Reference to Service model
  bio: { type: String }, // Provider's bio
  location: { type: String }, // Provider's working location
  averageRating: { type: Number, default: 0 }, // Average rating for provider
  totalRating: { type: Number, default: 0 }, // Total rating for provider
  verified: {
    type: Boolean,
    default: true, // Indicates if the provider is verified
  },
  // For both customers and providers
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }], // Appointments for both customers and providers
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  // Admin and Superadmin-specific fields
  permissions: {
    type: [String], // Admins and superadmins can have permissions like ["manageUsers", "manageServices", etc.]
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date
  }
}, { timestamps: true }); // Automatically adds `createdAt` and `updatedAt` timestamps

const User = mongoose.model("User", UserSchema);
export default User;