// import fs from 'fs';
// import multer from "multer"
// import path from 'path';

// //multer code
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "uploads/profilePictures"); // Directory where files will be saved
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
//       cb(null, file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1]); // File naming convention
//     },
// });


// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
// });

// export default upload

import multer from 'multer'
import fs from 'fs'
import path from 'path';

// Create directories for uploads if they don't exist
const createDirectory = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const profilePictureDir = "uploads/profilePictures";
const galleryDir = "uploads/gallery";
const serviceDir = "uploads/service";

createDirectory(profilePictureDir);
createDirectory(galleryDir);
createDirectory(serviceDir);


// Set up Multer to temporarily store files locally
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Determine the destination folder based on the field name
        if (file.fieldname === "profilePicture") {
            cb(null, profilePictureDir); // Profile picture folder
        } else if (file.fieldname === "galleryImages") {
            cb(null, galleryDir); // Gallery folder
        } else if (file.fieldname === "providerServiceImage") {
            console.log("Fieldname", file.fieldname)
            cb(null, serviceDir); // Gallery folder
        } else {
            cb(new Error("Invalid field name"), null);
        }
    },
    filename: (req, file, cb) => {
        // Generate a unique filename
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

// File type validation
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Unsupported file type. Only JPEG, PNG, and JPG are allowed."));
    }
};

// Configure upload instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max per file
});

export default upload