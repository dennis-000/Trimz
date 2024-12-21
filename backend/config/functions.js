import fs from 'fs/promises';
import path from 'path';

// Helper function to safely delete a file
export const deleteFile = async (filePath) => {
    try {
        if (!filePath) return;
        
        // Check if the file exists
        await fs.access(filePath); // Will throw an error if the file does not exist
        await fs.unlink(filePath);
        console.log(`File deleted successfully: ${filePath}`);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.warn(`File not found, skipping deletion: ${filePath}`);
        } else {
            console.error(`Error deleting file: ${filePath}`, error.message);
        }
    }
};
