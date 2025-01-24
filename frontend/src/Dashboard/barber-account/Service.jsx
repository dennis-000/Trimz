import { useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../config';
import GalleryUpload from './GalleryUpload';

/**
 * Service Component
 * Allows the management of barber services, including adding, editing, and removing services.
 * Handles image uploads and submits all services to the server.
 */
const Service = () => {
  const [selectedFile, setSelectedFile] = useState(null);
   const [formData, setFormData] = useState({
    name: '',
    provider: '',
    services: [], // Array to store all services
    price: '',
    duration: '',
    availability: '',
    averageRating: '',
    images: '',
    providersDescription: '',
  });

  const userInfo = JSON.parse(localStorage.getItem('user')); // Retrieve user info from localStorage
  const jwt = localStorage.getItem('token'); // Retrieve token from localStorage


  // Add a new service
  const addService = () => {
    const newService = {
      id: Date.now(), // Generate unique ID
      provider: userInfo?._id || '', // Default to current user's ID
      name: '',
      description: '',
      duration: '',
      price: '',
      image: null,
      imagePreview: null,
      availability: true, // Default to available
    };
    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, newService],
    }));
    toast.success('New service added.');
  };


 // Delete a service
 const deleteService = async (serviceId) => {
  try {
    const response = await fetch(`${BASE_URL}provider-services/${serviceId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${jwt}` },
    });

    if (response.ok) {
      setFormData((prev) => ({
        ...prev,
        services: prev.services.filter((service) => service.id !== serviceId),
      }));
      toast.success('Service deleted successfully.');
    } else {
      const errorData = await response.json();
      toast.error(`Error deleting service: ${errorData.message}`);
    }
  } catch (error) {
    toast.error(`An error occurred: ${error.message}`);
  }
};

  

  
    // Update service details
    const handleServiceChange = (index, event) => {
      const { name, value } = event.target;
  
      setFormData((prev) => {
        const updatedServices = [...prev.services];
        updatedServices[index] = { ...updatedServices[index], [name]: value };
        return { ...prev, services: updatedServices };
      });
    };



  // Handles image upload for a specific service
  const handleImageUpload = (index, file) => {
    const validImageTypes = ['image/jpeg', 'image/png'];
    if (!validImageTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a JPEG or PNG image.');
      return;
    }

    // Create a preview URL for the image
    const previewURL = URL.createObjectURL(file);
    setFormData((prev) => {
      const updatedServices = [...prev.services];
      updatedServices[index] = { ...updatedServices[index], image: file, imagePreview: previewURL };
      return { ...prev, services: updatedServices };
    });
    setSelectedFile(file);
  };

  // VALIDATION OF SERVICES
  const validateServices = () => {
    for (const service of formData.services) {
      if (!service.name || !service.description || !service.price || !service.duration || !service.image) {
        toast.error('All fields are required for each service.');
        return false;
      }
    }
    return true;
  };

  // Submits all services to the backend 
  const submitServices = async () => {
    if (!validateServices()) return;

    const providerId = userInfo?._id;
    if (!providerId) {
      toast.error('Provider ID not found.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('services', JSON.stringify(formData.services));
    formDataToSend.append('provider', providerId);
    if (selectedFile) formDataToSend.append('image', selectedFile);

    try {
       // Create a FormData instance for each service
    const promises = formData.services.map(async (service) => {
      const serviceFormData = new FormData();
      serviceFormData.append('name', service.name);
      serviceFormData.append('description', service.description);
      serviceFormData.append('duration', service.duration);
      serviceFormData.append('price', service.price);
      serviceFormData.append('availability', service.availability);
      serviceFormData.append('provider', providerId);
      
      if (service.image) {
        serviceFormData.append('image', service.image);
      }

      const response = await fetch(`${BASE_URL}provider-services`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${jwt}` ,
      },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`Failed to submit service: ${service.name}`);
      }

      return response.json();
    });

    await Promise.all(promises);
    toast.success('All services submitted successfully.');
    
    // Clear the form after successful submission
    setFormData(prev => ({
      ...prev,
      services: []
    }));
    
  } catch (error) {
    toast.error(`An error occurred: ${error.message}`);
  }
};

  return (
    <div className='mb-5'>
      <p className='form__label'>Manage Services</p>

      {formData.services.map((service, index) => (
        <div key={service.id} className="p-6 bg-white rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Service {index + 1}
          </h3>

          <div className="space-y-4">
            {/* Service Name Input */}
            <div>
              <input
                type="text"
                name="name"
                value={service.name}
                onChange={(e) => handleServiceChange(index, e)}
                placeholder="Service Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Service Description Input */}
            <div>
              <textarea
                name="description"
                value={service.description}
                onChange={(e) => handleServiceChange(index, e)}
                placeholder="Service Description"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-24 resize-none"
              />
            </div>

            {/* Duration and Price Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="duration"
                value={service.duration}
                onChange={(e) => handleServiceChange(index, e)}
                placeholder="Duration (e.g., 30 mins)"
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />

              <input
                type="number"
                name="price"
                value={service.price}
                onChange={(e) => handleServiceChange(index, e)}
                placeholder="Price in Cedis"
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Availability Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="availability"
                checked={service.availability}
                onChange={(e) =>
                  handleServiceChange(index, {
                    target: { name: 'availability', value: e.target.checked },
                  })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label className="text-gray-700">Available</label>
            </div>

            {/* Image Upload */}
            <div className="mt-4">
              <input
                type="file"
                accept="image/*"
                name="providerServiceImage"
                onChange={(e) => handleImageUpload(index, e.target.files[0])}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>

            {/* Image Preview */}
            {service.imagePreview && (
              <div className="mt-4">
                <img
                  src={service.imagePreview}
                  alt="Service Preview"
                  className="w-32 h-32 object-cover rounded-md"
                />
              </div>
            )}
          </div>

          {/* Remove Service Button */}
          <button
            type="button"
            onClick={() => deleteService(service.id)}
            className="bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px] cursor-pointer"
          >
            <AiOutlineDelete />
          </button>

        </div>
      ))}

      {/* Add New Service Button */}
      <button
        type='button'
        onClick={addService}
        className='bg-[#000] py-2 px-5 h-fit text-white cursor-pointer 
        btn mt-4 mr-4 rounded-[0px] rounded-r-md'
      >
        Add New Service
      </button>

      {/* Submit All Services Button */}
      {formData.services.length > 0 && (
        <button
          type='button'
          onClick={submitServices}
          className='bg-blue-600 py-2 px-5 h-fit text-white cursor-pointer btn mt-4 rounded-md'
        >
          Submit All Services
        </button>
      )}
      <div>
        <GalleryUpload/>
      </div>
    </div>
  );
};

export default Service;
