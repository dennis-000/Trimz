import { Router } from 'express'
import upload from '../config/upload.config.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { addGalleryImages, deleteGalleryImage } from '../controllers/gallery.controller.js';

const galleryRouter = Router()


// Add images to gallery
galleryRouter.post("/:id", requireAuth, upload.array("galleryImages", 10), addGalleryImages);
// Remove image from gallery
galleryRouter.delete("/:id", requireAuth, deleteGalleryImage);

export default galleryRouter