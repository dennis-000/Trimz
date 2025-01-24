import { useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { BASE_URL, token } from '../../config';
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

  // Adds a new service to the services array
  const addService = (newService) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      services: [...prevFormData.services, newService],
    }));
    toast.success('Service added successfully!');
  };

  // Removes a service from the services array
  const removeService = (serviceId) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      services: prevFormData.services.filter((service) => service.id !== serviceId),
    }));
    toast.info('Service removed.');
  };

  // Handles the creation of a new service with default values
  const handleAddService = () => {
    const newService = {
      id: Date.now(), // Unique ID
      createdAt: new Date().toISOString(), // Timestamp
      name: '',
      description: '',
      duration: '',
      price: '',
      image: null,
      imagePreview: null, // Added imagePreview for preview functionality
      availability: true, // Default availability
    };
    addService(newService);
  };

  // Updates service details in the services array
  const handleServiceChange = (index, event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => {
      const updatedServices = [...prevFormData.services];
      updatedServices[index] = { ...updatedServices[index], [name]: value };
      return { ...prevFormData, services: updatedServices };
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

    setFormData((prevFormData) => {
      const updatedServices = [...prevFormData.services];
      updatedServices[index].image = file;
      setSelectedFile(file);
      updatedServices[index].imagePreview = previewURL; // Set the preview URL
      return { ...prevFormData, services: updatedServices };
    });
  };

  
  const validateServices = () => {
    for (const service of formData.services) {
      if (!service.name || !service.description || !service.price || !service.duration) {
        toast.error('All fields are required for each service.');
        return false;
      }
    }
    return true;
  };
  // Submits all services to the backend API
  const submitServices = async () => {
     // Retrieve the provider's ID from localStorage
    const user = JSON.parse(localStorage.getItem('user')); // Ensure it’s parsed into an object
    const providerId = user?._id;

    if (!providerId) {
      toast.error('Provider ID not found in localStorage.');
      return;
    }

    if (formData.services.length === 0) {
      toast.error('Please add at least one service before submitting.');
      return;
    }
  
    if (!validateServices()) {
      return;
    }
  
    try {
      const formDataToSend = new FormData();
      formData.services.forEach((service, index) => {
        formDataToSend.append(`services[${index}][name]`, service.name);
        formDataToSend.append(`services[${index}][description]`, service.description);
        formDataToSend.append(`services[${index}][duration]`, service.duration);
        formDataToSend.append(`services[${index}][price]`, service.price);
        formDataToSend.append(`services[${index}][availability]`, service.availability);
        formDataToSend.append(`services[${index}][provider]`, providerId);
        if (service.image) {
          formDataToSend.append(`services[${index}][image]`, selectedFile);
        }
      });
  
      // formDataToSend.append('providersDescription', formData.providersDescription);
      console.log('FormData Contents:');
      formDataToSend.forEach((value, key) => {
        console.log(`${key}:`, value);
      });
  
      const res = await fetch(`${BASE_URL}provider-services`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'multipart/form-data',
        },
        body: formDataToSend,
      });
  
      if (res.ok) {
        toast.success('Services submitted successfully!');
      } else {
        const errorData = await res.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      toast.error('An error occurred while submitting services.' + error.message);
      console.error(error);
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
                name="image"
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
            type='button'
            onClick={() => removeService(service.id)}
            className='bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px] cursor-pointer'
          >
            <AiOutlineDelete />
          </button>
        </div>
      ))}

      {/* Add New Service Button */}
      <button
        type='button'
        onClick={handleAddService}
        className='bg-[#000] py-2 px-5 h-fit text-white cursor-pointer btn mt-0 rounded-[0px] rounded-r-md'
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
