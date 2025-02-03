import mongoose from "mongoose";
import ProviderService from "../models/providerService.model.js";
import { createAuditLog } from "./audit.controller.js";
import Appointment from "../models/appointment.model.js";
import cloudinary from "../config/cloudinary.config.js";
import { deleteFile } from "../config/functions.js";

export const getAllProviderService = async (req, res) => {
  try {
    const providerServices = await ProviderService.find({});
    res
      .status(200)
      .json({
        success: true,
        data: providerServices,
        message: "Provider Services retrieved successfully",
      });
  } catch (error) {
    console.log("Error in fetching services: ", error.message);
    return res
      .status(500)
      .json({ success: false, message: `Server Error: ${error.message}` });
  }
};
export const getAllProviderServicesByProviderId = async (req, res) => {
  const { providerId } = req.params;

  

  //Check if id is a valid mongoose valid
  if (!mongoose.Types.ObjectId.isValid(providerId)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid provider id" });
  }
  try {
    const providerServices = await ProviderService.find({ provider: providerId });
    res
      .status(200)
      .json({
        success: true,
        data: providerServices,
        message: "Provider's Services retrieved successfully",
      });
  } catch (error) {
    console.log("Error in fetching services: ", error.message);
    return res
      .status(500)
      .json({ success: false, message: `An error occured while retrieving services`, error: error.message });
  }
};

export const getSingleProviderService = async (req, res) => {
  const { id } = req.params;

  //Check if id is a valid mongoose valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid service id" });
  }

  try {
    const providerService = await ProviderService.findById(id);
    if (!providerService) {
      return res
        .status(404)
        .json({ success: false, message: "Provider Service not found" });
    }
    res
      .status(200)
      .json({
        success: true,
        data: providerService,
        message: "Provider Services retrieved successfully",
      });
  } catch (error) {
    console.log(
      `Error in fetching provider's services with id ${id}: `,
      error.message
    );
    return res
      .status(500)
      .json({ success: false, message: `An error occure while retrieving service`, error: error.message });
  }
};

export const createNewProviderService = async (req, res) => {
  try {
    const services = JSON.parse(req.body.services);
    const providerId = req.body.provider;
    const files = req.files?.providerServiceImage || []; // Files array for providerServiceImage
    console.log("Files: ", files);

    if (!Array.isArray(services)) {
      return res.status(400).json({
        success: false,
        message: "Services must be provided as an array",
      });
    }

    const createdServices = [];

    for (let index = 0; index < services.length; index++) {
      const serviceData = services[index];

      if (!serviceData.name || !serviceData.price || !serviceData.duration) {
        return res.status(400).json({
          success: false,
          message: "Name, price, and duration are required for each service",
        });
      }

      let imageData = null;

      // Match each file to its corresponding service (if any)
      if (files[index]) {
        const file = files[index];

        try {
          const uploadResult = await cloudinary.uploader.upload(file.path, {
            folder: "ecutz/provider-services",
          });

          imageData = {
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
          };
        } catch (error) {
          console.log('Cloudinary', error.message);
          return res.status(500).json({
            success: false,
            message: "Error uploading image to Cloudinary",
            error: error.message,
          });
        }
      }

      const newService = new ProviderService({
        name: serviceData.name,
        provider: providerId,
        price: parseFloat(serviceData.price),
        duration: parseInt(serviceData.duration),
        availability: serviceData.availability,
        description: serviceData.description,
        image: imageData,
      });

      const savedService = await newService.save();
      createdServices.push(savedService);

      if (files[index]) {
        await deleteFile(files[index].path);
      }
    }
    await createAuditLog(
      req.user ? req.user.id : "system",
      providerId,
      "ProviderService",
      "create",
      `New provider Service created`
    );

    res.status(201).json({
      success: true,
      message: "Services created successfully",
      data: createdServices,
    });
  } catch (error) {
    console.log("Error creating provider services: ", error.message);
    res.status(500).json({
      success: false,
      message: "Error creating provider services",
      error: error.message,
    });
  }
};

export const updateProviderService = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const file = req.file;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Service ID" });
  }

  try {
    const existingService = await ProviderService.findById(id);

    if (!existingService) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    let imageData = existingService.image;

    // Handle new image upload if provided
    if (file) {
      try {
        // Delete the old image from Cloudinary if it exists
        if (imageData && imageData.public_id) {
          await cloudinary.uploader.destroy(imageData.public_id);
        }
        // Upload the new image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          folder: "ecutz/provider-services",
        });

        imageData = {
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
        };

        await deleteFile(file.path);
        
      } catch (error) {
        console.log('Cloudinary', error);
        return res.status(500).json({
          success: false,
          message: "Error uploading image to Cloudinary",
          error: error.message,
        });
      }
    }

    // Update the service with the new data and image details
    const updatedProviderService = await ProviderService.findByIdAndUpdate(
      id,
      { ...updatedData, image: imageData },
      { new: true }
    );

    await createAuditLog(
      req.user ? req.user.id : "system",
      id,
      "ProviderService",
      "update",
      `Provider Service updated with changes: ${JSON.stringify(updatedProviderService)}`
    );

    res.status(200).json({
      success: true,
      message: "Provider Service updated successfully",
      data: updatedProviderService,
    });
  } catch (error) {
    console.error("Error occurred while updating service: ", error.message);
    return res.status(500).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

export const deleteProviderService = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Service ID" });
  }

  try {
    // Fetch the service to ensure it exists and retrieve image details
    const existingService = await ProviderService.findById(id);

    if (!existingService) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    // Delete the associated image from Cloudinary (if it exists)
    if (existingService.image && existingService.image.public_id) {
      try {
        await cloudinary.uploader.destroy(existingService.image.public_id);
      } catch (error) {
        console.error(
          `Error occurred while deleting image from Cloudinary: ${error.message}`
        );
        return res.status(500).json({
          success: false,
          message: "Error deleting image from Cloudinary",
          error: error.message,
        });
      }
    }

    // Delete the service from the database
    await ProviderService.findByIdAndDelete(id);

    // Log the deletion
    await createAuditLog(
      req.user ? req.user.id : "system",
      id,
      "ProviderService",
      "delete",
      `Provider Service deleted`
    );

    res.status(200).json({
      success: true,
      message: "Provider Service deleted successfully",
    });
  } catch (error) {
    console.error(`Error occurred while deleting service: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: `Server Error: ${error.message}` });
  }
};

export const getProviderProfile = async (req, res) => {
  const providerId = req.userId;

  try {
    const provider = await Provider.findById(providerId);

    if (!provider) {
      return res
        .status(404)
        .json({ success: false, message: "Provider not found" });
    }

    const { password, ...rest } = provider._doc;
    const appointments = await Appointment.find({ provider: providerId });

    res.status(200).json({
      success: true,
      message: "Profile information retrieved successfully",
      data: { ...rest, appointments },
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Something went wrong, cannot get" });
  }
};
