import { useState, useEffect } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { toast } from "react-toastify";
import { BASE_URL } from "../../config";
// import GalleryUpload from "./GalleryUpload";
import ServiceEdit from './ServiceEdit'; 



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

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);


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

  // =========== Delete existing service =============
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

  // Validates all services before submission
  // const validateServices = () => {
  //   for (const service of formData.services) {
  //     if (
  //       !service.name ||
  //       !service.description ||
  //       !service.price ||
  //       !service.duration
  //     ) {
  //       toast.error("All fields are required for each service.");
  //       return false;
  //     }
  //   }
  //   return true;
  // };

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

  const handleDeleteClick = (serviceId) => {
    setSelectedServiceId(serviceId);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedServiceId) {
      deleteExistingService(selectedServiceId);
      setShowConfirm(false);
      setSelectedServiceId(null);
    }
  };
  
  return (
    // Displaying the Services
    <div className="container mx-auto px-4 py-8 space-y-8">
      <ServiceEdit 
          isOpen={editModalOpen} 
          service={editingService} 
          onClose={() => setEditModalOpen(false)}
          onUpdate={updateExistingService}
        />
        <h3 className="text-2xl font-bold text-gray-800 ">
        Services Category
        </h3>

        {existingServices.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">
            No services found. Start by adding some services!
          </p>
        </div>
      ) : 
      (
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {existingServices.map((service) => (
            <div 
              key={service._id} 
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden"
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h4 className="text-xl font-semibold text-gray-800">
                  {service.name}
                </h4>
                <div className="flex space-x-2">
                <button 
                      onClick={() => {
                        setEditingService(service);
                        setEditModalOpen(true);
                      }}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      aria-label="Edit Service"
                    >
                      <AiOutlineEdit size={20} />
                  </button>
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteClick(service._id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    aria-label="Delete Service"
                  >
                    <AiOutlineDelete size={20} />
                  </button>
                </div>
              </div>


      {/* =========== Confirmation Modal ============== */}
      {showConfirm && (
  <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm">
    <div className="bg-white/80 p-5 rounded-lg shadow-md w-[90%] md:w-[350px] border border-gray-300">
      
      {/* Header */}
      <h2 className="text-lg font-medium text-gray-800">Confirm Deletion</h2>

      {/* Modal Content */}
      <p className="text-gray-600 mt-2 text-sm">
        Are you sure you want to delete this service?
      </p>

      {/* Action Buttons */}
      <div className="mt-4 flex justify-end space-x-3">
        <button
          onClick={() => setShowConfirm(false)}
          className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={confirmDelete}
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}


              
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
                  <div className="mt-6">
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
          


      {/* ============ Add Services Form ==============*/}      
      <p className="form__label">Add Services</p>
      {formData.services.map((service, index) => (
  <div
    key={service.id}
    className="bg-white rounded-lg shadow-lg border border-gray-200 mb-6 overflow-hidden"
  >
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          Service {index + 1}
        </h3>
        <button
          type="button"
          onClick={() => removeService(service.id)}
          className="text-red-500 hover:text-red-700 transition-colors"
          aria-label="Remove Service"
        >
          <AiOutlineDelete size={24} />
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Name
            </label>
            <input
              type="text"
              name="name"
              value={service.name}
              onChange={(e) => handleServiceChange(index, e)}
              placeholder="Enter service name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={service.description}
              onChange={(e) => handleServiceChange(index, e)}
              placeholder="Describe your service"
              className="w-full px-4 py-2 border border-gray-300 rounded-md h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={service.duration}
                onChange={(e) => handleServiceChange(index, e)}
                placeholder="e.g., 30 mins"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (Cedis)
              </label>
              <input
                type="number"
                name="price"
                value={service.price}
                onChange={(e) => handleServiceChange(index, e)}
                placeholder="Service price"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="availability"
              checked={service.availability}
              onChange={(e) =>
                handleServiceChange(index, {
                  target: { name: "availability", value: e.target.checked },
                })
              }
              className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <label className="text-sm text-gray-700">
              Service Available
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Image
            </label>
            <input
              type="file"
              accept="image/*"
              name="providerServiceImage"
              onChange={(e) => handleImageUpload(index, e.target.files[0])}
              className="w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          {service.imagePreview && (
            <div className="mt-4">
              <img
                src={service.imagePreview}
                alt="Service Preview"
                className="w-full h-48 object-cover rounded-md shadow-md"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
      ))}

      <div className="flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={handleAddService}
          className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          <span className="mr-2">+</span> Add New Service
        </button>

        {formData.services.length > 0 && (
          <button
            type="button"
            onClick={submitServices}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Submit Services
          </button>
        )}
      </div>
              {/*<GalleryUpload providerId={JSON.parse(localStorage.getItem("user"))._id} />*/}
      </div>

  );
}

export default Service;