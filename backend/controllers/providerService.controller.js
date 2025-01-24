import mongoose from "mongoose";
import ProviderService from "../models/providerService.model.js";
import { createAuditLog } from "./audit.controller.js";
import Appointment from "../models/appointment.model.js";
import cloudinary from '../config/cloudinary.config.js';


export const getAllProviderService = async(req, res) => {
    try {
        const providerServices = await ProviderService.find({})
        res.status(200).json({ success: true, data: providerServices, message: "Provider Services retrieved successfully" })
    } catch (error) {
        console.log("Error in fetching services: ", error.message);
        return res.status(500).json({ success: false, message: `Server Error: ${error.message}` })
    }
}

export const getSingleProviderService = async(req, res) => {
    const { id } = req.params

    //Check if id is a valid mongoose valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid service id" })
    }

    try {
        const providerService = await ProviderService.findById(id)
        if (!providerService) {
            return res.status(404).json({ success: false, message: "Provider Service not found" });
        }
        res.status(200).json({ success: true, data: providerService, message: "Provider Services retrieved successfully" })
    } catch (error) {
        console.log(`Error in fetching provider's services with id ${id}: `, error.message);
        return res.status(500).json({ success: false, message: `Server Error: ${error.message}` })
    }
}

export const createNewProviderService = async (req, res) => {
    try {
      const services = JSON.parse(req.body.services);
      const providerId = req.body.provider;
      const files = req.files;
      console.log("Files: ",files);
  
      if (!Array.isArray(services)) {
        return res.status(400).json({
          success: false,
          message: 'Services must be provided as an array',
        });
      }
  
      const createdServices = [];
  
      for (let index = 0; index < services.length; index++) {
        const serviceData = services[index];
  
        if (!serviceData.name || !serviceData.price || !serviceData.duration) {
          return res.status(400).json({
            success: false,
            message: 'Name, price, and duration are required for each service',
          });
        }
  
        let imageData = null;
  
        if (files[`providerServiceImage[${index}]`]) {
          const file = files[`providerServiceImage[${index}]`][0];
  
          try {
            const uploadResult = await uploadToCloudinary(file.path, {
              folder: 'provider-services',
            });
  
            imageData = {
              url: uploadResult.secure_url,
              public_id: uploadResult.public_id,
            };
          } catch (error) {
            return res.status(500).json({
              success: false,
              message: 'Error uploading image to Cloudinary',
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
      }
  
      res.status(201).json({
        success: true,
        message: 'Services created successfully',
        data: createdServices,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating provider services',
        error: error.message,
      });
    }
};  


export const updateProviderService = async(req, res) => {
    const { id } = req.params

    const providerService = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Service ID" })
    }

    try {
        const updatedProviderService = await ProviderService.findByIdAndUpdate(id, providerService, { new: true })

        if (!updatedProviderService) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        await createAuditLog(req.user ? req.user.id : "system", id, "ProviderService", "update", `Provider Service updated with changes: ${JSON.stringify(updatedProviderService)}`);

        res.status(200).json({ success: true, message: "Provider Service Updated successfully", data: updatedProviderService })
    } catch (error) {
        console.log("Error occured while updating service: ", error.message);
        return res.status(500).json({ success: false, message: `Server Error: ${error.message}` })
    }
}

export const deleteProviderService = async(req, res) => {
    const { id } = req.params
    console.log("id:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Service ID" })
    }

    try {
        await ProviderService.findByIdAndDelete(id)

        await createAuditLog(req.user ? req.user.id : "system", id, "ProviderService", "delete", `Provider Service deleted`);

        res.status(200).json({ success: true, message: "Provider Service Deleted successfully" })

    } catch (error) {
        console.log(`Error occurred while deleting service: ${error.message}`)
        return res.status(500).json({ success: false, message: `Server Error: ${error.message}` })
    }
}

export const getProviderProfile = async(req, res) => {
    const providerId = req.userId

    try {
        const provider = await Provider.findById(providerId)

        if (!provider) {
            return res.status(404).json({ success: false, message: 'Provider not found' })
        }

        const { password, ...rest } = provider._doc
        const appointments = await Appointment.find({ provider: providerId })

        res.status(200).json({
            success: true,
            message: 'Profile information retrieved successfully',
            data: {...rest, appointments },
        });
    } catch (err) {
        res.status(500)
            .json({ success: false, message: "Something went wrong, cannot get" })
    }
}