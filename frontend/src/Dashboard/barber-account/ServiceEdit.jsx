/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { BASE_URL } from "../../config";
import { X } from "lucide-react";

const ServiceEdit = ({ isOpen, service, onClose, onUpdate }) => {
  const [editingService, setEditingService] = useState(null);


  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      // Disable scrolling on the body
      document.body.style.overflow = 'hidden';
      
      // Add event listener to prevent scroll on background
      const preventScroll = (e) => {
        e.preventDefault();
      };
      document.body.addEventListener('wheel', preventScroll, { passive: false });
      document.body.addEventListener('touchmove', preventScroll, { passive: false });

      // Cleanup function to re-enable scrolling
      return () => {
        document.body.style.overflow = 'unset';
        document.body.removeEventListener('wheel', preventScroll);
        document.body.removeEventListener('touchmove', preventScroll);
      };
    }
  }, [isOpen]);


  // Update local state when service prop changes
  useEffect(() => {
    if (service) {
      setEditingService({...service});
    }
  }, [service]);

  // If modal isn't open or no service, return null
  if (!isOpen || !editingService) return null;

  const handleEditServiceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingService(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditImageUpload = (file) => {
    const validImageTypes = ["image/jpeg", "image/png"];
    if (!validImageTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload a JPEG or PNG image.");
      return;
    }

    const previewURL = URL.createObjectURL(file);

    setEditingService(prev => ({
      ...prev,
      image: file,
      imagePreview: previewURL
    }));
  };

//   const handleUpdate = async () => {
//     try {
//       // Call the onUpdate prop passed from parent component
//       await onUpdate(editingService._id, editingService);
//       onClose(); // Close the modal after successful update
//     } catch (error) {
//       toast.error(`An error occurred: ${error.message}`);
//     }
//   };
const handleUpdate = async () => {
    // Validate input fields
    if (!editingService.name || !editingService.description) {
      toast.error("Please fill in all required fields");
      return;
    }
  
    // Create a FormData object for handling file uploads
    const formData = new FormData();
    
    // Append all service details to FormData
    Object.keys(editingService).forEach(key => {
      if (key !== 'image' && key !== 'imagePreview') {
        formData.append(key, editingService[key]);
      }
    });
  
    // Handle image upload if a new image is selected
    if (editingService.image instanceof File) {
      formData.append('providerServiceImage', editingService.image);
    }
try {
    // Show loading toast
    const loadingToastId = toast.loading("Updating service...", { autoClose: false });

  const jwt = localStorage.getItem("token");
// Make API call to update service
const response = await fetch(`${BASE_URL}provider-services/${editingService._id}`, {
    method: 'PATCH',
    body: formData, // Use FormData for file uploads
    // Include credentials if using authentication
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  // Check if the response is successful
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update service');
  }

  // Parse the updated service data
  const updatedService = await response.json();

  // Close the loading toast
  toast.dismiss(loadingToastId, {
    render: "Service updated successfully",
    type: "success",
    autoClose: 3000
  });


  // Call the onUpdate prop to update the local state
  onUpdate(editingService._id, updatedService);

  // Close the modal
  onClose();

} catch (error) {
  // Handle any errors during the update process
  toast.error(`Update failed: ${error.message}`);
  console.error("Service update error:", error);
}
};
  return (
    <div 
    className="fixed inset-0 z-50 overflow-y-auto"
    aria-modal="true"
    role="dialog"
  >
    {/* Overlay with fixed positioning and full-screen coverage */}
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
      onClick={onClose}
    ></div>

    {/* Modal container with centered positioning */}
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto"
        // Prevent clicks on modal from closing it
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

{/* Modal Content */}
<div className="p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-3">
              Edit Service
            </h2>        
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={editingService.name}
            onChange={handleEditServiceChange}
            placeholder="Service Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />

          <textarea
            name="description"
            value={editingService.description}
            onChange={handleEditServiceChange}
            placeholder="Description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md h-20"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              name="price"
              value={editingService.price}
              onChange={handleEditServiceChange}
              placeholder="Price (Cedis)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="duration"
              value={editingService.duration}
              onChange={handleEditServiceChange}
              placeholder="Duration"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="availability"
              checked={editingService.availability}
              onChange={handleEditServiceChange}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label className="text-gray-700">Available</label>
          </div>

          <div>
            <input
              type="file"
              accept="image/*"
              name="providerServiceImage"
              onChange={(e) => handleEditImageUpload(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700"
            />
          </div>

          {(editingService.imagePreview || editingService.image?.url) && (
            <img
              src={editingService.imagePreview || editingService.image.url}
              alt="Service Preview"
              className="w-full h-64 object-contain rounded-md"
            />
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
}

export default ServiceEdit;