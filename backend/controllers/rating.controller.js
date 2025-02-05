import Appointment from "../models/appointment.model.js";
import Review from "../models/review.model.js";
import User from "../models/user.model.js";

export const getSingleUserRatings = async (req, res) => {
  const { id } = req.params

  try{
    const appointments = await Appointment.find({ provider: id }).populate("service", "name") // Ensure "Service" is correctly registered
    .populate("customer", "name") // Ensure "User" is correctly registered
    .populate("provider", "name");
    if (appointments.length === 0) {
      return res.status(404).json({ message: "No ratings found for the user." });
    }
    res.status(200).json({ 
      message: "Ratings retrieved successfully.", 
      ratings: appointments.map(appt => ({
          service: appt.service?.title || "No Service found",
          provider: appt.provider?.name || "No provider found",
          customer: appt.customer?.name || "No customer found",
          providerService: appt.providerService?.name || "No providerService found",
          score: appt.rating.score,
          comment: appt.rating.comment || "No comment",
          date: appt.date,
          startTime: appt.startTime,
          duration: appt.duration
      }))
  });
    
  }
  catch(error){
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
}

export const rateAppointment = async (req, res) => {
  const { appointment_id } = req.params; // Appointment ID
  const { rating } = req.body; // Rating details
  const { score, comment } = rating;

  try {
    const appointment = await Appointment.findById(appointment_id);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    if (appointment.status !== "completed") {
      return res.status(400).json({ error: "Only completed appointments can be rated" });
    }

    if (appointment.rating?.score) {
      return res.status(400).json({ error: "This appointment is already rated" });
    }

    // Update the appointment rating
    appointment.rating = { score, comment };
    const updatedAppointment = await appointment.save();

    // Recalculate provider's average rating using both Appointments and Reviews
    const providerId = appointment.provider;

    // Get ratings from Appointments
    const appointmentRatings = await Appointment.aggregate([
      { $match: { provider: providerId, "rating.score": { $ne: null } } },
      { 
        $group: { 
          _id: null, 
          totalAppointments: { $sum: 1 }, 
          avgAppointmentRating: { $avg: "$rating.score" } 
        } 
      },
    ]);

    // Get ratings from Reviews
    const reviewRatings = await Review.aggregate([
      { $match: { provider: providerId, rating: { $ne: null } } },
      { 
        $group: { 
          _id: null, 
          totalReviews: { $sum: 1 }, 
          avgReviewRating: { $avg: "$rating" } 
        } 
      },
    ]);

    // Extract values, defaulting to 0 if no ratings exist
    const totalAppointments = appointmentRatings.length > 0 ? appointmentRatings[0].totalAppointments : 0;
    const avgAppointmentRating = appointmentRatings.length > 0 ? appointmentRatings[0].avgAppointmentRating : 0;

    const totalReviews = reviewRatings.length > 0 ? reviewRatings[0].totalReviews : 0;
    const avgReviewRating = reviewRatings.length > 0 ? reviewRatings[0].avgReviewRating : 0;

    // Calculate the combined total ratings and weighted average rating
    const totalRatings = totalAppointments + totalReviews;
    let averageRating = 0;

    if (totalRatings > 0) {
      averageRating = ((avgAppointmentRating * totalAppointments) + (avgReviewRating * totalReviews)) / totalRatings;
    }

    // Update the provider's rating details
    await User.findByIdAndUpdate(providerId, { 
      averageRating, 
      totalRatings 
    });

    res.status(200).json({ 
      success: true, 
      message: "Rating added and provider average updated successfully", 
      data: updatedAppointment 
    });
  } catch (error) {
    console.error("Error in rating appointment:", error);
    res.status(500).json({ error: "An error occurred while rating the appointment" });
  }
};

export const updateAverageRating = async () => {
    try {
        const providers = await User.find({ role: "provider" });

        for (const provider of providers) {
            // Get ratings from the Appointments model
            const appointmentRatings = await Appointment.aggregate([
                { $match: { provider: provider._id, "rating.score": { $ne: null } } },
                { 
                    $group: { 
                        _id: null, 
                        totalAppointments: { $sum: 1 }, 
                        avgAppointmentRating: { $avg: "$rating.score" } 
                    } 
                },
            ]);

            // Get ratings from the Reviews model
            const reviewRatings = await Review.aggregate([
                { $match: { provider: provider._id, rating: { $ne: null } } },
                { 
                    $group: { 
                        _id: null, 
                        totalReviews: { $sum: 1 }, 
                        avgReviewRating: { $avg: "$rating" } 
                    } 
                },
            ]);

            // Extract values, defaulting to 0 if no ratings exist
            const totalAppointments = appointmentRatings.length > 0 ? appointmentRatings[0].totalAppointments : 0;
            const avgAppointmentRating = appointmentRatings.length > 0 ? appointmentRatings[0].avgAppointmentRating : 0;

            const totalReviews = reviewRatings.length > 0 ? reviewRatings[0].totalReviews : 0;
            const avgReviewRating = reviewRatings.length > 0 ? reviewRatings[0].avgReviewRating : 0;

            // Calculate the combined total ratings and weighted average rating
            const totalRatings = totalAppointments + totalReviews;
            let averageRating = 0;

            if (totalRatings > 0) {
                averageRating = ((avgAppointmentRating * totalAppointments) + (avgReviewRating * totalReviews)) / totalRatings;
            }

            // Update the provider's rating details
            await User.findByIdAndUpdate(provider._id, { 
                averageRating, 
                totalRatings 
            });
        }

        console.log("Provider ratings updated successfully from both Appointments & Reviews");
    } catch (error) {
        console.error("Error updating provider ratings:", error);
    }
};


// Delete Rating
export const deleteRating = async (req, res) => {
  const { appointment_id } = req.params;

  try {
      // Find the appointment
      const appointment = await Appointment.findById(appointment_id);

      if (!appointment) {
          return res.status(404).json({ message: 'Appointment not found' });
      }

      if (!appointment.rating) {
          return res.status(400).json({ message: 'No rating to delete' });
      }

      const providerId = appointment.provider;

      // Remove the rating
      appointment.rating = undefined;
      await appointment.save();

      // Recalculate the provider's average rating
      const providerAppointments = await Appointment.find({
          provider: providerId,
          rating: { $exists: true },
      });

      const totalRatings = providerAppointments.length;
      const averageRating =
          totalRatings > 0
              ? providerAppointments.reduce((sum, app) => sum + app.rating.score, 0) / totalRatings
              : 0;

      await User.findByIdAndUpdate(providerId, { averageRating });

      res.status(200).json({ success: true, message: 'Rating deleted and average updated', averageRating });
  } catch (error) {
      console.error('Error deleting rating:', error);
      res.status(500).json({success: false, message: 'Error deleting rating', error });
  }
};