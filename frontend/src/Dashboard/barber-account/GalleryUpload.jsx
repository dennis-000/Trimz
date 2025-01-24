import { useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { BASE_URL, token } from '../../config';

/**
 * Gallery Component
 * Allows barbers to upload and preview gallery pictures before submitting to the backend.
 */
const GalleryUpload = () => {
  const [images, setImages] = useState([]); // Array to store uploaded images

  // Handles image upload with validation and preview functionality
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
      const filePreviews = validFiles.map((file) => {
        return {
          file,
          preview: URL.createObjectURL(file),
        };
      });

      setImages((prevImages) => [...prevImages, ...filePreviews]);
      toast.success('Images added successfully!');
    }
  };

  // Removes an image from the preview list
  const removeImage = (index) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      URL.revokeObjectURL(updatedImages[index].preview); // Revoke preview URL
      updatedImages.splice(index, 1);
      return updatedImages;
    });
    toast.info('Image removed.');
  };

  // Submits all uploaded images to the backend
  const submitGallery = async () => {
    if (images.length === 0) {
      toast.error('Please add at least one image before submitting.');
      return;
    }

    const formData = new FormData();
    images.forEach((imageObj, index) => {
      formData.append(`image${index}`, imageObj.file);
    });

    try {
      const res = await fetch(`${BASE_URL}barber-gallery`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        toast.success('Gallery images submitted successfully!');
        setImages([]); // Clear images after successful submission
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
    <div className='mb-5'>
      <p className='form__label'>Upload Gallery Pictures</p>

      {/* Image Upload Input */}
      <input
        type='file'
        accept='image/*'
        multiple
        onChange={handleImageUpload}
        className='block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100'
      />

      {/* Image Previews */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4'>
        {images.map((imageObj, index) => (
          <div key={index} className='relative'>
            <img
              src={imageObj.preview}
              alt={`Preview ${index}`}
              className='w-full h-32 object-cover rounded-md shadow-md'
            />
            <button
              type='button'
              onClick={() => removeImage(index)}
              className='absolute top-2 right-2 bg-red-600 p-1 rounded-full text-white text-[12px] cursor-pointer'
            >
              <AiOutlineDelete />
            </button>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      {images.length > 0 && (
        <button
          type='button'
          onClick={submitGallery}
          className='bg-blue-600 py-2 px-5 h-fit text-white cursor-pointer btn mt-4 rounded-md'
        >
          Submit Gallery
        </button>
      )}
    </div>
  );
};

export default GalleryUpload;
