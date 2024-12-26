import { useState } from 'react';
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
      <button onClick={handleAddService}>Add New Service</button>
      {formData.services.map((service, index) => (
        <div key={service.id} className="service-form">
          <h3>Service {index + 1}</h3>
          <input
            type="text"
            name="name"
            value={service.name}
            onChange={(e) => handleServiceChange(index, e)}
            placeholder="Service Name"
          />
          <textarea
            name="description"
            value={service.description}
            onChange={(e) => handleServiceChange(index, e)}
            placeholder="Service Description"
          />
          <input
            type="text"
            name="duration"
            value={service.duration}
            onChange={(e) => handleServiceChange(index, e)}
            placeholder="Duration (e.g., 30 mins)"
          />
          <input
            type="number"
            name="price"
            value={service.price}
            onChange={(e) => handleServiceChange(index, e)}
            placeholder="Price in Cedis"
          />
          <input
            type="checkbox"
            name="availability"
            checked={service.availability}
            onChange={(e) =>
              handleServiceChange(index, { target: { name: 'availability', value: e.target.checked } })
            }
          />
          <label>Available</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(index, e.target.files[0])}
          />
          <button onClick={() => removeService(service.id)}>Remove Service</button>
        </div>
      ))}
    </div>
  );
};

export default ServiceManagement;
