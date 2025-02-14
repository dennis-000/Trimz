import mongoose from 'mongoose'
import User from "../models/user.model.js";
import { hashPassword } from "../server.js";
import { createAuditLog } from './audit.controller.js';
import fs from 'fs'
import cloudinary from '../config/cloudinary.config.js';
import upload from '../config/upload.config.js';
import { deleteFile } from '../config/functions.js';


// export const removeGalleryPhotos = async (publicIds) => {
//     for (const publicId of publicIds) {
//         // Delete the file from Cloudinary using its public_id
//         await cloudinary.uploader.destroy(publicId);
//     }
// };

export const addGalleryImages = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: "No images provided" });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const uploadedImages = [];
        for (const file of req.files) {
            // Upload each file to Cloudinary
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'ecutz/gallery',
            });

            // Add the image details to the uploadedImages array
            uploadedImages.push({ url: result.secure_url, public_id: result.public_id });

            // Remove the file from the local server
            await deleteFile(file.path)
        }

        // Update the user's gallery
        user.gallery.push(...uploadedImages);
        await user.save();

        await createAuditLog(req.user ? req.user.id : "system", id, "User", "Create", `Image Added to Gallery`);

        res.status(200).json({ success: true, message: "Images added to gallery", data: user.gallery });
    } catch (error) {
        console.error("Error adding images to gallery:", error.message);
        return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};



export const deleteGalleryImage = async (req, res) => {
    const { id } = req.params;
    const { imageIds } = req.body;
    console.log('Image ID: ', req.body);
    try {
        if (!Array.isArray(imageIds) || imageIds.length === 0) {
            return res.status(400).json({ success: false, message: "No image IDs provided" });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

       // Filter out images that are not in the gallery
       const validImages = imageIds.filter(imageId => 
        user.gallery.some(image => image.public_id === imageId)
        );

        if (validImages.length === 0) {
            return res.status(404).json({ success: false, message: "No valid images found for deletion" });
        }

        // Remove images from Cloudinary
        for (const imageId of validImages) {
            await cloudinary.uploader.destroy(imageId);
        }

        // Remove the images from the user's gallery
        user.gallery = user.gallery.filter(image => !validImages.includes(image.public_id));
        await user.save();

        await createAuditLog(req.user ? req.user.id : "system", id, "User", "delete", `Multiple images removed from gallery`);

        res.status(200).json({ 
            success: true, 
            message: `${validImages.length} image(s) removed from gallery`, 
            data: user.gallery
        });

    } catch (error) {
        console.error("Error removing image from gallery:", error.message);
        return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};