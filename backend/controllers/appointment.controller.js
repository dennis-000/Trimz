import mongoose from "mongoose";
import Appointment from "../models/appointment.model.js";
import { appointmentIsActive } from "../server.js";
import { createAuditLog } from "./audit.controller.js";
import ProviderService from '../models/providerService.model.js';


export const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({})
        res.status(200).json({success: true, data: appointments, message: "Appointments retrieved successfully"})
    } catch (error) {
        console.log("Error occurred while fetching appointments: ", error.message);
        return res.status(500).json({success: false, message: `Server Error: ${error.message}`})
    }
}

export const getSingleAppointment = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success:false, message: "Appointment not found"})
    }

    try {
        const appointment = await Appointment.findById(id)
        res.status(200).json({success: true, data: appointment, message: "Appointment retrieved successfully"})
    } catch (error) {
        console.log(`Error occurred while fetching appointment with id ${id}: `, error.message);
        return res.status(500).json({success: false, message: `Server Error: ${error.message}`})
    }
}

export const createAppointment = async (req, res) => {
    try {
        const request = req.body;
        request.customer = req.user.id;

        // Ensure providerServices is an array
        if (!Array.isArray(request.providerServices)) {
            request.providerServices = [request.providerServices];
        }

        // Validate the providerServices exist and belong to the provider
        const validServices = await ProviderService.find({
            _id: { $in: request.providerServices },
            provider: request.provider
        });

        if (validServices.length !== request.providerServices.length) {
            return res.status(400).json({ success: false, message: "One or more selected services are invalid or do not belong to this provider." });
        }

        // Check for overlapping appointments for this provider
        const startTime = new Date(request.startTime);
        const endTime = new Date(startTime.getTime() + request.duration * 60000); // Convert minutes to milliseconds

        const overlappingAppointment = await Appointment.findOne({
            provider: request.provider,
            date: request.date,
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } }, // Overlapping check
            ]
        });

        if (overlappingAppointment) {
            return res.status(400).json({ success: false, message: "Provider is unavailable at the selected time." });
        }

        // Create the appointment
        const newAppointment = new Appointment(request);
        const savedAppointment = await newAppointment.save();

        // Audit log
        await createAuditLog(req.user ? req.user.id : "system", newAppointment._id, "Appointment", "create", "Appointment created");

        res.status(201).json({ success: true, message: "Appointment created successfully", data: savedAppointment });

    } catch (error) {
        console.log("Error occurred while saving Appointment: ", error.message);
        return res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
    }
};


export const updateAppointment = async (req, res) => {
    const { id } = req.params

    const request = req.body

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success:false, message: "Appointment not found"})
    }
    
    try{
        const updatedAppointment = await Appointment.findByIdAndUpdate(id, request, { new: true })

        if(!updatedAppointment){
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        await createAuditLog(req.user ? req.user.id : "system", id, "Appointment", "update", `Appointment updated with changes: ${JSON.stringify(updatedAppointment)}`);

        res.status(200).json({success: true, message: "Appointment Updated successfully", data: updatedAppointment})
    } catch(error) {
        console.log(`Error occured while updating appointment with id ${id}: `, error.message);
        return res.status(500).json({success: false, message: `Server Error: ${error.message}`})
    }
}

export const deleteAppointment = async (req, res) => {
    const { id } = req.params
    console.log("id:",id);

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success:false, message: "Appointment not found"})
    }

    try {
        const deletedAppointment = await Appointment.findByIdAndDelete(id)

        if (!deletedAppointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        await createAuditLog(req.user ? req.user.id : "system", id, "Appointment", "delete", `Appointment deleted`);

        res.status(200).json({success: true, message: "Appointment Deleted successfully"})

    } catch (error) {
        console.log(`Error in deleting appointment with id ${id}: ${error.message}`)
        return res.status(500).json({success: false, message: `Server Error: ${error.message}`})
    }
}

export const getUserAppointments = async(req,res) => {
    try {
        console.log('User: ', req.user);
        const appointments = await Appointment.find({ customer: req.user.id }).populate('provider').populate('providerServices').sort({ createdAt: -1 });
        console.log(appointments);

        if(!appointments || appointments.length === 0){
            return res.status(200).json({ 
                success: true, 
                message: "No appointments found" 
            });
        }

        res.status(200).json({
            success: true,
            message: "Appointments fetched successfully",
            data: appointments
        });
    } catch (err) {
        res.status(500).json({
            success: false, 
            message: "Something went wrong, cannot get user appointments"
        });
    }
}
export const getProviderAppointments = async(req,res) => {
    try {
        // Ensure you're using 'customer' instead of 'user'
        const appointments = await Appointment.find({ provider: req.user.id }).populate('customer').populate('providerServices');
        console.log(appointments);

        if(!appointments || appointments.length === 0){
            return res.status(404).json({ 
                success: false, 
                message: "No appointments found" 
            });
        }

        res.status(200).json({
            success: true,
            message: "Appointments fetched successfully",
            data: appointments
        });
    } catch (err) {
        res.status(500).json({
            success: false, 
            message: "Something went wrong, cannot get user appointments"
        });
    }
}