import { useState, useEffect } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { toast } from "react-toastify";
import { BASE_URL } from "../../config";
import GalleryUpload from "./GalleryUpload";



/**
 * Service Component
 * Allows the management of barber services, including adding, editing, and removing services.
 * Handles image uploads and submits all services to the server.
 */
const Service = () => {
  const [selectedFiles, setSelectedFiles] = useState([]); // To handle multiple files
  const [existingServices, setExistingServices] = useState([]); // New state for existing services
  const [formData, setFormData] = useState({
    name: "",
    provider: "",
    services: [], // Array to store all services
    price: "",
    duration: "",
    availability: "",
    averageRating: "",
    images: "",
    providersDescription: "",
  });




  // Fetch existing services when component mounts
  useEffect(() => {
    fetchExistingServices();
  }, []);

  // Fetch existing services for the provider
  const fetchExistingServices = async () => {
    try {
      const jwt = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      
      if (!jwt || !user?._id) {
        toast.error("Authentication required");
        return;
      }
      // GET THE REQUEST FROM THE SERVICE THE PROVIDER POST
      const response = await fetch(`${BASE_URL}provider-services/provider/${user._id}`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const services = await response.json();
        console.log(services);
        setExistingServices(services.data);
      } else {
        const errorData = await response.json();
        toast.error(`Error fetching services: ${errorData.message}`);
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`);
    }
  };

  // Update existing service
  const updateExistingService = async (serviceId, updatedData) => {
    try {
      const jwt = localStorage.getItem("token");
      const formDataToSend = new FormData();
      
      // Append updated service data
      Object.keys(updatedData).forEach(key => {
        formDataToSend.append(key, updatedData[key]);
      });

// ====== UPDATE =====
      const response = await fetch(`${BASE_URL}provider-services/${serviceId}`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${jwt}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        toast.success("Service updated successfully!");
        fetchExistingServices(); // Refresh the services list
      } else {
        const errorData = await response.json();
        toast.error(`Error updating service: ${errorData.message}`);
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`);
    }
  };

  // Delete existing service
  const deleteExistingService = async (serviceId) => {
    try {
      const jwt = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}provider-services/${serviceId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        toast.success("Service deleted successfully!");
        fetchExistingServices(); // Refresh the services list
      } else {
        const errorData = await response.json();
        toast.error(`Error deleting service: ${errorData.message}`);
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`);
    }
  };






  // Adds a new service to the services array
  // const addService = (newService) => {
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     services: [...prevFormData.services, newService],
  //   }));
  //   toast.success("Service added successfully!");
  // };

  // Removes a service from the services array
  const removeService = (serviceId) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      services: prevFormData.services.filter(
        (service) => service.id !== serviceId
      ),
    }));
    toast.info("Service removed.");
  };

  const userInfo = JSON.parse(localStorage.getItem("user"));

  // Handles the creation of a new service with default values
  const handleAddService = () => {
    const newService = {
      id: Date.now(), // Unique ID
      provider: userInfo._id,
      service: "",
      name: "",
      description: "",
      duration: "",
      price: "",
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
//  const deleteService = async (serviceId) => {
//   try {
//     const response = await fetch(`${BASE_URL}provider-services/${serviceId}`, {
//       method: 'DELETE',
//       headers: { Authorization: `Bearer ${jwt}` },
//     });

//     if (response.ok) {
//       setFormData((prev) => ({
//         ...prev,
//         services: prev.services.filter((service) => service.id !== serviceId),
//       }));
//       toast.success('Service deleted successfully.');
//     } else {
//       const errorData = await response.json();
//       toast.error(`Error deleting service: ${errorData.message}`);
//     }
//   } catch (error) {
//     toast.error(`An error occurred: ${error.message}`);
//   }
// };

  

  
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
    const validImageTypes = ["image/jpeg", "image/png"];
    if (!validImageTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload a JPEG or PNG image.");
      return;
    }

    // Create a preview URL for the image
    const previewURL = URL.createObjectURL(file);

    setFormData((prevFormData) => {
      const updatedServices = [...prevFormData.services];
      updatedServices[index].image = file;
      updatedServices[index].imagePreview = previewURL; // Set the preview URL
      return { ...prevFormData, services: updatedServices };
    });

    setSelectedFiles((prevFiles) => [...prevFiles, file]); // Add the file to selectedFiles
  };

  const validateServices = () => {
    for (const service of formData.services) {
      if (
        !service.name ||
        !service.description ||
        !service.price ||
        !service.duration
      ) {
        toast.error("All fields are required for each service.");
        return false;
      }
    }
    return true;
  };

  // Submits all services to the backend API
 // Modified submitServices to refresh existing services after submission
  const submitServices = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const providerId = user?._id;

    if (!providerId) {
      toast.error("Provider ID not found in localStorage.");
      return;
    }

    if (formData.services.length === 0) {
      toast.error("Please add at least one service before submitting.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("services", JSON.stringify(formData.services));
      formDataToSend.append("provider", providerId);

      // Append each selected file
      selectedFiles.forEach((file) => {
        formDataToSend.append("providerServiceImage", file);
      });

      const jwt = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}provider-services`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        toast.success("Services submitted successfully!");
        fetchExistingServices(); // Refresh the existing services
        // Reset the form after successful submission
        setFormData(prev => ({ ...prev, services: [] }));
        setSelectedFiles([]);
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      toast.error(
        "An error occurred while submitting services: " + error.message
      );
      console.error(error);
    }
  };

  
  return (

    <div className="container mx-auto px-4 py-8">
        <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 mb-6">
        All Services
        </h3>

        {existingServices.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">
            No services found. Start by adding some services!
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {existingServices.map((service) => (
            <div 
              key={service._id} 
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h4 className="text-xl font-semibold text-gray-800">
                  {service.name}
                </h4>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => updateExistingService(service._id)}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                    aria-label="Edit Service"
                  >
                    <AiOutlineEdit size={20} />
                  </button>
                  <button 
                    onClick={() => deleteExistingService(service._id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    aria-label="Delete Service"
                  >
                    <AiOutlineDelete size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 font-medium">Description</p>
                    <p className="text-gray-800">{service.description}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Price</p>
                    <p className="text-gray-800">
                      {service.price} <span className="text-sm text-gray-500">Cedis</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Duration</p>
                    <p className="text-gray-800">{service.duration}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Status</p>
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        service.availability 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {service.availability ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
                
                {service.image && (
                  <div className="mt-4">
                    <img 
                      src={service.image.url} 
                      alt={service.name} 
                      className="w-full h-48 object-cover rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>
            </div>
             ))}
          </div>
          )}


      <p className="form__label">Manage Services</p>
      {formData.services.map((service, index) => (
        <div
          key={service.id}
          className="p-6 bg-white rounded-lg shadow-md mb-6"
        >
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
                    target: { name: "availability", value: e.target.checked },
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
            onClick={() => removeService(service.id)}
            className="bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px] cursor-pointer"
          >
            <AiOutlineDelete />
          </button>
        </div>
      ))}

      {/* Add New Service Button */}
      <button
        type="button"
        onClick={handleAddService}
        className="bg-[#000] py-2 px-5 h-fit text-white cursor-pointer btn mt-0 rounded-[0px] rounded-r-md"
      >
        Add New Service
      </button>

      {/* Submit All Services Button */}
      {formData.services.length > 0 && (
        <button
          type="button"
          onClick={submitServices}
          className="bg-blue-600 py-2 px-5 h-fit text-white cursor-pointer btn mt-4 rounded-md"
        >
          Submit All Services
        </button>
      )}
      <div>
        <GalleryUpload />
      </div>
    </div>
  );
}

export default Service;
