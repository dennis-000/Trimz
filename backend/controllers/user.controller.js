import mongoose from 'mongoose'
import User from "../models/user.model.js";
import { hashPassword } from "../server.js";
import { createAuditLog } from './audit.controller.js';
import fs from 'fs'
import cloudinary from '../config/cloudinary.config.js';
import upload from '../config/upload.config.js';
import path from "path"
import { deleteFile } from '../config/functions.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).json({success: true, data: users, message: "Users retrieved successfully"})
    } catch (error) {
        console.log("Error in fetching users: ", error.message);
        return res.status(500).json({success: false, message: `Server Error: ${error.message}`})
    }
}

export const getAllProviders = async (req, res) => {
    try {
        const users = await User.find({ role: "provider" }).sort({ averageRating: -1 })
        res.status(200).json({success: true, data: users, message: "Providers retrieved successfully"})
    } catch (error) {
        console.log("Error in fetching providers: ", error.message);
        return res.status(500).json({success: false, message: `Server Error: ${error.message}`})
    }
}

export const getAllCustomers = async (req, res) => {
    try {
        const users = await User.find({ role: "customer" })
        res.status(200).json({success: true, data: users, message: "Users retrieved successfully"})
    } catch (error) {
        console.log("Error in fetching users: ", error.message);
        return res.status(500).json({success: false, message: `Server Error: ${error.message}`})
    }
}

export const getSingleUserById = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success:false, message: "Invalid User ID"})
    }

    try {
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({success: true, data: user, message: "User retrieved successfully"})
    } catch (error) {
        console.log(`Error in fetching user with id ${id}: `, error.message);
        return res.status(500).json({success: false, message: `Server Error: ${error.message}`})
    }
}

export const createNewUser = async (req, res) => {
    try {
        let { name, email, password, role, phone, location, verified, status, profilePicture, gender, available } = req.body
        console.log(profilePicture);

        const existingUser = await User.findOne({ email })

        if(existingUser){
            return res.status(400).json({success: false, message: "User already exists"})
        }
        
        const hash = await hashPassword(password)

        if(req.file){
            console.log(req.file.path);
            const imagePath = req.file.path
            console.log(imagePath);
            // Upload image to Cloudinary with a specified folder
            const result = await cloudinary.uploader.upload(imagePath, {
            folder: 'ecutz/profilePictures'  // Specify your folder here
            });

            profilePicture = {
                url: result.secure_url,
                public_id: result.public_id
            }
        }

        const newUser = new User({
            name,
            email,
            password: hash,
            role,
            gender,
            phone,
            location,
            status: role === "provider" ? "inactive" : "active",
            profilePicture: req.file ? profilePicture : null,
            available: available || false,
        })

        const newCreatedUser = await newUser.save()

        if (req.file) {
            await deleteFile(req.file.path)
        }
        console.log(req.user);

        await createAuditLog(req.user ? req.user.id : "system", newCreatedUser._id, "User", "create", "New User was created"); //Log user creation

        res.status(201).json({success: true, message: "User created successfully", data: newCreatedUser})
    } catch (error) {
        console.log(`Error in creating user: `, error.message);
        return res.status(500).json({success: false, message: `Server Error: ${error.message}`})
    }
}


export const getUserProfile = async(req, res)=>{
    const userId = req.userId

    try {
        const user = await User.findById(userId)

        if (!user){
            return res.status(404).json({success: false, message: 'User not found'})
        }

        const {password, ...rest} = user._doc

        res.status(200).json({ success: true, message: 'Profile information retrieved successfully', data: { ...rest } });
    } catch(err) {
        res.status(500)
        .json({success: false, message:"Something went wrong, cannot get"})
    }
}




    

   

export const updateUser = async (req, res) => {
    const { id } = req.params
    try{

    let { name, email, password, gender, role, phone, location, verified, status, profilePicture, bio, about, workingHours, available, achievements, experience, specialization,timeSlots } = req.body
    console.log(req.body)
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success:false, message: "Invalid User ID"})
    }
    
    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if email is being updated and if it's unique
    if (email && email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already in use" });
        }
    }

    // Process achievements and workingHours if they are strings
    if (typeof achievements === "string") {
        try {
          achievements = JSON.parse(achievements);
        } catch (error) {
          console.error("Error parsing achievements:", error.message);
        }
      }
    if (typeof timeSlots === "string") {
        try {
          timeSlots = JSON.parse(timeSlots);
        } catch (error) {
          console.error("Error parsing timeSlots:", error.message);
        }
    }
    if (typeof experience === "string") {
        try {
          experience = JSON.parse(experience);
        } catch (error) {
          console.error("Error parsing experience:", error.message);
        }
    }

     // Update profile picture if provided and delete the old one
     let updatedProfilePic = user.profilePicture
     if (req.file) {
        console.log(req.file);
        // Delete old profile picture from cloudinary if it exists
        if (user.profilePicture && user.profilePicture.public_id) {
            await cloudinary.uploader.destroy(user.profilePicture.public_id);
        }
        
        // Update with new profile picture
        // Upload new profile picture to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'ecutz/profilePictures',
        });
        updatedProfilePic = {
            url: result.secure_url,
            public_id: result.public_id,
        };
        await deleteFile(req.file.path)
    }

    let hash = user.password
    if(password){
        hash = await hashPassword(password)
    }

    const updatedUser = {
        name: name || user.name,
        email: email || user.email,
        password: hash,
        role: role || user.role,
        gender: gender || user.gender,
        phone: phone || user.phone,
        location: location || user.location,
        bio: bio || user.bio,
        about: about || user.about,
        status: status || user.status,
        verified: verified || user.verified,
        profilePicture: req.file ? updatedProfilePic : profilePicture,
        available: available || user.available,
        achievements: achievements || user.achievements,
        experience: experience || user.experience,
        specialization: specialization || user.specialization,
        workingHours: timeSlots || user.workingHours,
    }


        const newUpdatedUser = await User.findByIdAndUpdate(id, updatedUser, { new: true })

        console.log(newUpdatedUser);

        if (!newUpdatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        console.log(`User ID: ${req.user.id}`, `Id: ${id}`);
        await createAuditLog(req.user.id, id, "User", "update", `Updated user with changes: ${JSON.stringify(updatedUser)}`);

        res.status(200).json({success: true, message: "User Updated successfully", data: newUpdatedUser,})
    } catch(error) {
        console.log(`Error in fetching user with id ${id}: `, error.message);
        return res.status(500).json({success: false, message: `Server Error: ${error.message}`})
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params
    console.log("id:",id);

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success:false, message: "Invalid User ID"})
    }

    try {
        const deletedUser = await User.findByIdAndDelete(id)

        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Delete profile picture if it exists
        if (deletedUser.profilePicture && deletedUser.profilePicture.public_id) {
            await cloudinary.uploader.destroy(deletedUser.profilePicture.public_id);
        }

        await createAuditLog(req.user.id, deletedUser._id, "User", "delete", "User Deleted"); //Log user deletion

        res.status(200).json({success: true, message: "User Deleted successfully"})
    } catch (error) {
        console.log(`Error in deleting user with id ${id}: ${error.message}`)
        return res.status(500).json({success: false, message: `Server Error: ${error.message}`})
    }
}