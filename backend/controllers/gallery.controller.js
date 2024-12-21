import mongoose from 'mongoose'
import User from "../models/user.model.js";
import { hashPassword } from "../server.js";
import { createAuditLog } from './audit.controller.js';
import fs from 'fs'
import cloudinary from '../config/cloudinary.config.js';
import upload from '../config/upload.config.js';
import { deleteFile } from '../config/functions.js';

// const deleteFile = async (filePath) => {
//     try {
//         if (!filePath) return;
        
//         // Check if the file exists
//         await fs.access(filePath); // Will throw an error if the file does not exist
//         await fs.unlink(filePath);
//         console.log(`File deleted successfully: ${filePath}`);
//     } catch (error) {
//         if (error.code === 'ENOENT') {
//             console.warn(`File not found, skipping deletion: ${filePath}`);
//         } else {
//             console.error(`Error deleting file: ${filePath}`, error.message);
//         }
//     }
// };

// export const addGalleryPhotos = async (files) => {
//     const gallery = [];

//     for (const file of files) {
//         // Upload each file to Cloudinary
//         const result = await cloudinary.uploader.upload(file.path, {
//             folder: 'ecutz/gallery',
//         });

//         // Add the uploaded file's URL and public ID to the gallery
//         gallery.push({
//             url: result.secure_url,
//             public_id: result.public_id,
//         });
//     }

//     return gallery;
// };

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
    const { imageId } = req.query;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Find the photo to remove
        const imageIndex = user.gallery.findIndex(image => image.public_id === imageId);
        if (imageIndex === -1) {
            return res.status(404).json({ success: false, message: "image not found" });
        }

        // Remove the image from Cloudinary
        await cloudinary.uploader.destroy(imageId);

        // Remove the image from the user's gallery
        user.gallery.splice(imageIndex, 1);
        await user.save();

        await createAuditLog(req.user ? req.user.id : "system", id, "User", "delete", `Image Removed from Gallery`);

        res.status(200).json({ success: true, message: "Image removed from gallery", data: user.gallery });
    } catch (error) {
        console.error("Error removing image from gallery:", error.message);
        return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};