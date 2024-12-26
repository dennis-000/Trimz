import { useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { toast } from 'react-toastify';

const ServiceManagement = () => {
  const [formData, setFormData] = useState({
    services: [], // Array to store all services
  });

  const addService = (newService) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      services: [...prevFormData.services, newService],
    }));
    toast.success('Service added successfully!');
  };

  const removeService = (serviceId) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      services: prevFormData.services.filter((service) => service.id !== serviceId),
    }));
    toast.info('Service removed.');
  };

  const handleAddService = () => {
    const newService = {
      id: Date.now(), // Unique ID
      createdAt: new Date().toISOString(), // Timestamp
      name: '',
      description: '',
      duration: '',
      price: '',
      image: null,
      availability: true, // Default availability
    };
    addService(newService);
  };

  const handleServiceChange = (index, event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => {
      const updatedServices = [...prevFormData.services];
      updatedServices[index] = { ...updatedServices[index], [name]: value };
      return { ...prevFormData, services: updatedServices };
    });
  };

  const handleImageUpload = (index, file) => {
    const validImageTypes = ['image/jpeg', 'image/png'];
    if (!validImageTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a JPEG or PNG image.');
      return;
    }
    setFormData((prevFormData) => {
      const updatedServices = [...prevFormData.services];
      updatedServices[index].image = file;
      return { ...prevFormData, services: updatedServices };
    });
  };

  return (
    <div className='mb-5'>
      <p className='form__label'>
        Manage Services
        </p>
      
      {formData.services.map((service, index) => (
       <div key={service.id} className="p-6 bg-white rounded-lg shadow-md mb-6">
       <h3 className="text-xl font-semibold mb-4 text-gray-800">Service {index + 1}</h3>
       
       <div className="space-y-4">
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
     
         <div>
           <textarea
             name="description"
             value={service.description}
             onChange={(e) => handleServiceChange(index, e)}
             placeholder="Service Description"
             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-24 resize-none"
           />
         </div>
     
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
     
         <div className="flex items-center space-x-2">
           <input
             type="checkbox"
             name="availability"
             checked={service.availability}
             onChange={(e) =>
               handleServiceChange(index, { target: { name: 'availability', value: e.target.checked } })
             }
             className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
           />
           <label className="text-gray-700">Available</label>
         </div>
     
         <div className="mt-4">
           <input
             type="file"
             accept="image/*"
             onChange={(e) => handleImageUpload(index, e.target.files[0])}
             className="block w-full text-sm text-gray-500
               file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700
               hover:file:bg-blue-100"
           />
         </div>
       </div>
        <button 
          type='button'
          onClick={() => removeService(service.id)}
          className='bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px] cursor-pointer'
          >
            <AiOutlineDelete/>
            </button>
        </div>

        
      ))}


<button 
      type='button'
      onClick={handleAddService}
      className='bg-[#000] py-2 px-5 h-fit text-white cursor-pointer btn mt-0 rounded-[0px] rounded-r-md'
      >Add New Service</button>
    </div>
  );
};

export default ServiceManagement;
