/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../config';

const GalleryUpload = ({ providerId }) => {
  const [images, setImages] = useState([]); // For newly uploaded images (previews)
  const [galleryImages, setGalleryImages] = useState([]); // For images already in the gallery
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  console.log(providerId);

  // Fetch existing gallery images on component mount or when providerId changes
  useEffect(() => {
    if (providerId) {
      fetchGalleryImages();
    }
  }, [providerId]);

  // Fetch gallery images from the user endpoint
  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}users/${providerId}`, {
        method: 'GET',
      });
      if (res.ok) {
        const response = await res.json();
        // Assuming the user object contains a 'gallery' field
        console.log('Gallery:', response.data.gallery);
        setGalleryImages(response.data.gallery || []);
      } else {
        toast.error('Failed to fetch gallery images');
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
      toast.error('Error loading gallery images');
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload and preview for new images
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];

    const validFiles = files.filter((file) => {
      if (!validImageTypes.includes(file.type)) {
        toast.error(`Invalid file type: ${file.name}. Please upload JPEG, PNG, or WEBP images.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      const filePreviews = validFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages((prevImages) => [...prevImages, ...filePreviews]);
      toast.success('Images added successfully!');
    }
  };

  // Remove a preview image from the new uploads list
  const removePreviewImage = (index) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      URL.revokeObjectURL(updatedImages[index].preview);
      updatedImages.splice(index, 1);
      return updatedImages;
    });
    toast.info('Preview image removed');
  };

  // Delete an image from the existing gallery (by its Cloudinary public_id)
  const deleteGalleryImage = async (publicId) => {
    try {
      console.log('Public ID: ', JSON.stringify({ imageIds: [publicId] }));
      const res = await fetch(`${BASE_URL}users/gallery/${providerId}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageIds: [publicId] }),
      });
      if (res.ok) {
        setGalleryImages((prevImages) =>
          prevImages.filter((image) => image.public_id !== publicId)
        );
        toast.success('Image deleted successfully');
      } else {
        toast.error('Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Error deleting image');
    }
  };

  // Submit new uploaded images to the backend
  const submitGallery = async () => {
    if (images.length === 0) {
      toast.error('Please add at least one image before submitting.');
      return;
    }

    const formData = new FormData();
    images.forEach((imageObj, index) => {
      // Use a key that your backend expects; here we simply use "image" for each file
      formData.append(`galleryImages`, imageObj.file);
    });

    try {
      console.log("Provider: ", providerId);
      const res = await fetch(`${BASE_URL}users/gallery/${providerId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (res.ok) {
        toast.success('Gallery images uploaded successfully!');
        setImages([]); // Clear new images preview
        fetchGalleryImages(); // Refresh existing gallery images
      } else {
        const errorData = await res.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      toast.error('An error occurred while submitting images.');
      console.error(error);
    }
  };

  return (
    <div className="mb-5">
      <h2 className="text-xl font-bold mb-4">Gallery Management</h2>

      {/* Upload Section */}
      <div className="mb-8">
        <p className="form__label">Upload New Pictures</p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />

        {/* Upload Previews */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {images.map((imageObj, index) => (
              <div key={index} className="relative">
                <img
                  src={imageObj.preview}
                  alt={`Preview ${index}`}
                  className="w-full h-32 object-cover rounded-md shadow-md"
                />
                <button
                  type="button"
                  onClick={() => removePreviewImage(index)}
                  className="absolute top-2 right-2 bg-red-600 p-1 rounded-full text-white text-[12px] cursor-pointer"
                >
                  <AiOutlineDelete />
                </button>
              </div>
            ))}
          </div>
        )}

        {images.length > 0 && (
          <button
            type="button"
            onClick={submitGallery}
            className="bg-blue-600 py-2 px-5 h-fit text-white cursor-pointer btn mt-4 rounded-md"
          >
            Upload New Images
          </button>
        )}
      </div>

      {/* Existing Gallery Section */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Current Gallery</h3>
        {loading ? (
          <p className="text-center text-zinc-600">Loading gallery...</p>
        ) : galleryImages.length == 0 ? (
          <p className="text-zinc-600">No images in the gallery</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image) => (
              <div key={image.public_id} className="relative">
                <img
                  src={image.url}
                  alt={`Gallery ${image.public_id}`}
                  className="w-full h-32 object-cover rounded-md shadow-md"
                />
                <button
                  type="button"
                  onClick={() => deleteGalleryImage(image.public_id)}
                  className="absolute top-2 right-2 bg-red-600 p-1 rounded-full text-white text-[12px] cursor-pointer"
                >
                  <AiOutlineDelete />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryUpload;

