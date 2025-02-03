import { Router } from "express";
import { createNewReview, deleteReview, getAllReviews, getSingleUserReviews, updateReview } from "../controllers/review.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const reviewRouter = Router()

//Review
reviewRouter.get("/", getAllReviews)
reviewRouter.get("/user/:id", getSingleUserReviews)//Get all reviews of a particular user
reviewRouter.post("/:id", requireAuth, createNewReview)
reviewRouter.patch("/:id",requireAuth, updateReview)
reviewRouter.delete("/:id",requireAuth, deleteReview)

export default reviewRouter