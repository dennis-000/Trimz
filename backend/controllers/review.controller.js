import mongoose from "mongoose";
import Review from "../models/review.model.js";
import { createAuditLog } from "./audit.controller.js";

export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({})
        res.status(200).json({success: true, data: reviews, message: "Reviews retrieved successfully"})
    } catch (error) {
        console.log("Error in fetching reviews: ", error.message);
        return res.status(500).json({success: false, message: `Server Error: ${error.message}`})
    }
}
export const getSingleUserReviews = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success:false, message: "Invalid Review ID"})
    }

    try {
        const reviews = await Review.find({ provider: id }).populate('customer')

        if (reviews.length === 0) {
            return res.status(404).json({ success: false, message: "No reviews found for this user" });
        }

        console.log(reviews);

        res.status(200).json({success: true, data: reviews, message: "Reviews retrieved successfully"})
    } catch (error) {
        console.log(`Error in fetching reviews of user ${id}: `, error.message);
        return res.status(500).json({success: false, message: `Server Error: ${error.message}`})
    }
}

export const createNewReview = async (req, res) => {
    const { id } = req.params
    const { rating, reviewText } = req.body
    
    try {
        const newReview = new Review({
            customer: req.user.id,
            provider: id,
            rating,
            comment: reviewText
        })
        await newReview.save()

        await createAuditLog(req.user ? req.user.id : "system", newReview._id, "Review", "create", "Review created");

        res.status(201).json({success: true, message: "Review created successfully"})
    } catch (error) {
        console.log("Error occured while saving review: ", error.message);
        return res.status(500).json({success: false, message: `Server Error: ${error.message}`})
    }
}

export const updateReview = async (req, res) => {
    const { id } = req.params

    const request = req.body

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success:false, message: "Invalid Review ID"})
    }

    try{
        const newReview = await Review.findByIdAndUpdate(id, request, { new: true })

        await createAuditLog(req.user ? req.user.id : "system", newReview._id, "Review", "update", `Review updated with changes: ${JSON.stringify(newReview)}`);

        res.status(200).json({success: true, message: "Review updated successfully", data: newReview})
    } catch(error) {
        console.log(`Error occured while updating review with id ${id}: `, error.message);
        return res.status(500).json({success: false, message: `Server Error: ${error.message}`})
    }
}

export const deleteReview = async (req, res) => {
    const { id } = req.params
    console.log("id:",id);

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success:false, message: "Invalid Review ID"})
    }

    try {
        const newReview = await Review.findByIdAndDelete(id)

        await createAuditLog(req.user ? req.user.id : "system", newReview._id, "Review", "delete", "Review deleted");

        res.status(200).json({success: true, message: "Review Deleted successfully"})

    } catch (error) {
        console.log(`Error in deleting review with id ${id}: ${error.message}`)
        return res.status(500).json({success: false, message: `Server Error: ${error.message}`})
    }
}