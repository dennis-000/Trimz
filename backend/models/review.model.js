import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
        required: true
    },
    comment: { type: String },
}, { timestamps: true });

const Review = mongoose.model("Review", ReviewSchema)
export default Review