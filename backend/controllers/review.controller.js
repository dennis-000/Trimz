import mongoose from "mongoose";
import Review from "../models/review.model.js";
import { createAuditLog } from "./audit.controller.js";
import Appointment from "../models/appointment.model.js";
import User from "../models/user.model.js";

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
    const { id } = req.params; // Provider ID
    const { rating, reviewText } = req.body; // rating should be a number; reviewText is the comment
  
    try {
      // Create the new review document
      const newReview = new Review({
        customer: req.user.id,
        provider: id,
        rating,
        comment: reviewText,
      });
      await newReview.save();
  
      await createAuditLog(
        req.user ? req.user.id : "system",
        newReview._id,
        "Review",
        "create",
        "Review created"
      );
  
      // ----------------------------
      // Aggregate appointment ratings
      // ----------------------------
      const appointmentAggregation = await Appointment.aggregate([
        {
          $match: {
            provider: new mongoose.Types.ObjectId(id),
            "rating.score": { $ne: null }
          }
        },
        {
          $group: {
            _id: null,
            appointmentAvg: { $avg: "$rating.score" },
            appointmentCount: { $sum: 1 }
          }
        }
      ]);
  
      // ----------------------------
      // Aggregate review ratings
      // ----------------------------
      const reviewAggregation = await Review.aggregate([
        {
          $match: {
            provider: new mongoose.Types.ObjectId(id),
            rating: { $ne: null }
          }
        },
        {
          $group: {
            _id: null,
            reviewAvg: { $avg: "$rating" },
            reviewCount: { $sum: 1 }
          }
        }
      ]);
  
      // Extract values (if no ratings exist, default to zero)
      const appointmentCount = appointmentAggregation.length > 0 ? appointmentAggregation[0].appointmentCount : 0;
      const appointmentAvg = appointmentAggregation.length > 0 ? appointmentAggregation[0].appointmentAvg : 0;
      const reviewCount = reviewAggregation.length > 0 ? reviewAggregation[0].reviewCount : 0;
      const reviewAvg = reviewAggregation.length > 0 ? reviewAggregation[0].reviewAvg : 0;
  
      // Combine the counts and weighted averages
      const totalCount = appointmentCount + reviewCount;
      const overallAverage = totalCount > 0
        ? ((appointmentAvg * appointmentCount) + (reviewAvg * reviewCount)) / totalCount
        : 0;
  
      // Update the provider's document in the User model
      await User.findByIdAndUpdate(id, {
        averageRating: overallAverage,
        totalRating: totalCount
      });
  
      res.status(201).json({
        success: true,
        message: "Review created successfully and provider ratings updated",
        data: newReview
      });
    } catch (error) {
      console.log("Error occured while saving review: ", error.message);
      return res.status(500).json({
        success: false,
        message: `Server Error: ${error.message}`
      });
    }
};

export const updateReview = async (req, res) => {
  const { id } = req.params;
  const request = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Review ID" });
  }

  try {
    // Update the review document
    const updatedReview = await Review.findByIdAndUpdate(id, request, { new: true });
    if (!updatedReview) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    await createAuditLog(
      req.user ? req.user.id : "system",
      updatedReview._id,
      "Review",
      "update",
      `Review updated with changes: ${JSON.stringify(updatedReview)}`
    );

    // Get the provider ID from the updated review
    const providerId = updatedReview.provider;

    // Aggregate ratings from appointments for this provider
    const appointmentAggregation = await Appointment.aggregate([
      {
        $match: {
          provider: mongoose.Types.ObjectId(providerId),
          "rating.score": { $ne: null }
        }
      },
      {
        $group: {
          _id: null,
          appointmentAvg: { $avg: "$rating.score" },
          appointmentCount: { $sum: 1 }
        }
      }
    ]);

    // Aggregate ratings from reviews for this provider
    const reviewAggregation = await Review.aggregate([
      {
        $match: {
          provider: mongoose.Types.ObjectId(providerId),
          rating: { $ne: null }
        }
      },
      {
        $group: {
          _id: null,
          reviewAvg: { $avg: "$rating" },
          reviewCount: { $sum: 1 }
        }
      }
    ]);

    const appointmentCount = appointmentAggregation.length > 0 ? appointmentAggregation[0].appointmentCount : 0;
    const appointmentAvg = appointmentAggregation.length > 0 ? appointmentAggregation[0].appointmentAvg : 0;
    const reviewCount = reviewAggregation.length > 0 ? reviewAggregation[0].reviewCount : 0;
    const reviewAvg = reviewAggregation.length > 0 ? reviewAggregation[0].reviewAvg : 0;

    const totalCount = appointmentCount + reviewCount;
    const overallAverage = totalCount > 0 
      ? ((appointmentAvg * appointmentCount) + (reviewAvg * reviewCount)) / totalCount
      : 0;

    // Update the provider's overall rating in the User model
    await User.findByIdAndUpdate(providerId, {
      averageRating: overallAverage,
      totalRating: totalCount
    });

    res.status(200).json({
      success: true,
      message: "Review updated successfully and provider ratings updated",
      data: updatedReview
    });
  } catch (error) {
    console.log(`Error occurred while updating review with id ${id}: `, error.message);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
  }
};

export const deleteReview = async (req, res) => {
  const { id } = req.params;
  console.log("Review ID to delete:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Review ID" });
  }

  try {
    // Delete the review document
    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    await createAuditLog(
      req.user ? req.user.id : "system",
      deletedReview._id,
      "Review",
      "delete",
      "Review deleted"
    );

    // Get the provider ID from the deleted review
    const providerId = deletedReview.provider;

    // Aggregate ratings from appointments for the provider
    const appointmentAggregation = await Appointment.aggregate([
      {
        $match: {
          provider: mongoose.Types.ObjectId(providerId),
          "rating.score": { $ne: null }
        }
      },
      {
        $group: {
          _id: null,
          appointmentAvg: { $avg: "$rating.score" },
          appointmentCount: { $sum: 1 }
        }
      }
    ]);

    // Aggregate ratings from reviews for the provider (after deletion)
    const reviewAggregation = await Review.aggregate([
      {
        $match: {
          provider: mongoose.Types.ObjectId(providerId),
          rating: { $ne: null }
        }
      },
      {
        $group: {
          _id: null,
          reviewAvg: { $avg: "$rating" },
          reviewCount: { $sum: 1 }
        }
      }
    ]);

    const appointmentCount = appointmentAggregation.length > 0 ? appointmentAggregation[0].appointmentCount : 0;
    const appointmentAvg = appointmentAggregation.length > 0 ? appointmentAggregation[0].appointmentAvg : 0;
    const reviewCount = reviewAggregation.length > 0 ? reviewAggregation[0].reviewCount : 0;
    const reviewAvg = reviewAggregation.length > 0 ? reviewAggregation[0].reviewAvg : 0;

    const totalCount = appointmentCount + reviewCount;
    const overallAverage = totalCount > 0 
      ? ((appointmentAvg * appointmentCount) + (reviewAvg * reviewCount)) / totalCount
      : 0;

    // Update the provider's overall rating in the User model
    await User.findByIdAndUpdate(providerId, {
      averageRating: overallAverage,
      totalRating: totalCount
    });

    res.status(200).json({
      success: true,
      message: "Review deleted successfully and provider ratings updated"
    });
  } catch (error) {
    console.log(`Error in deleting review with id ${id}: ${error.message}`);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
  }
};