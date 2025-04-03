/* eslint-disable react/prop-types */
// import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { formateDate } from "../../utils/formateDate";
import { useState } from "react";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";
import Error from "../../components/Error/Error";

const Appointments = ({ appointments, refreshAppointments }) => {
  // Local state to track which appointment is being edited
  const [editingAppointment, setEditingAppointment] = useState(null);
  // Local state for the form data in the edit modal
  const [editFormData, setEditFormData] = useState({});

  // Handler to open the modal and populate the form with the appointment’s data
  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setEditFormData({
      date: appointment.date, // should be an ISO string
      startTime: appointment.startTime, // ISO string or time string
      status: appointment.status,
      paymentStatus: appointment.paymentStatus,
    });
  };

  // Handler for input changes inside the modal
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler to send the PATCH request to update the appointment
  const handleUpdateAppointment = async () => {
    try {
      const jwt = localStorage.getItem("token");
      // Format the startTime as needed – ensure it becomes a valid Date object
      const formattedTime =
        editFormData.date.split("T")[0] +
        "T" +
        editFormData.startTime +
        ":00.000Z";
      // Build the updated data object
      const updatedData = {
        date: editFormData.date,
        startTime: new Date(formattedTime),
      };
      console.log("Updated data:", formattedTime);

      const res = await fetch(
        `${BASE_URL}appointments/${editingAppointment._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message);
      }
      toast.success("Appointment updated successfully");
      // Close modal and refresh appointments list
      setEditingAppointment(null);
      if (refreshAppointments) refreshAppointments();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handler to send a DELETE request for an appointment
  const handleDelete = async (appointmentId) => {
    try {
      const jwt = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}appointments/${appointmentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message);
      }
      toast.success("Appointment deleted successfully");
      if (refreshAppointments) refreshAppointments();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Close the modal without updating
  const closeModal = () => {
    setEditingAppointment(null);
  };

  console.log(appointments);
  return (
    <div className="w-full overflow-x-auto shadow-md sm:rounded-lg">
      <div className="min-w-full p-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Appointments
        </h2>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Provider
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Payment
                </th>
                <th scope="col" className="px-6 py-3">
                  Time
                </th>
                <th scope="col" className="px-6 py-3">
                  Mobile
                </th>
                <th scope="col" className="px-6 py-3">
                  Services
                </th>
                <th scope="col" className="px-6 py-3">
                  Scheduled date
                </th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((item) => (
                <tr
                  key={item._id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <th
                    scope="row"
                    className="flex items-center px-6 py-4 text-gray-900"
                  >
                    <img
                      src={
                        item.provider?.profilePicture?.url ||
                        "/placeholder.jpg"
                      }
                      className="w-10 h-10 rounded-full object-cover"
                      alt=""
                    />
                    <div className="pl-3">
                      <div className="text-base font-semibold">
                        {item.provider?.name || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.provider?.email || "N/A"}
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">{item.status}</td>
                  <td className="px-6 py-4">
                    {item.paymentStatus === "paid" ? (
                      <div className="flex items-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                        Paid
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                        Not Paid
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {(new Date(item.startTime)).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4">{item.provider?.phone || "N/A"}</td>
                  <td className="px-6 py-4">
                    {Array.isArray(item.providerServices)
                      ? item.providerServices.map((i) => i.name).join(", ")
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">{formateDate(item.date)}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-500 hover:underline"
                      title="Edit Appointment"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 hover:underline"
                      title="Delete Appointment"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {appointments.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 rounded-lg shadow space-y-3"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={
                    item.provider?.profilePicture?.url ||
                    "/placeholder.jpg"
                  }
                  className="w-12 h-12 rounded-full object-cover"
                  alt=""
                />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {item.provider?.name || "N/A"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {item.provider?.email || "N/A"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="font-medium text-gray-500">Status</p>
                  <p>{item.status}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Payment</p>
                  {item.paymentStatus === "paid" ? (
                    <div className="flex items-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                      Paid
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                      Not Paid
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-500">Phone</p>
                  <p>{item.provider?.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Services</p>
                  <p>
                    {Array.isArray(item.providerServices)
                      ? item.providerServices.map((i) => i.name).join(", ")
                      : "N/A"}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium text-gray-500">Scheduled Date</p>
                  <p>{formateDate(item.date)}</p>
                </div>
              </div>
            </div>
          ))} 
        </div>

        {/* No Appointments Message */}
        {appointments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No appointments found</p>
          </div>
        )}
      </div>

      {/* Modal for editing appointment */}
      {editingAppointment && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg z-10 w-11/12 md:w-1/2"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Edit Appointment</h2>

            {/* Date Input */}
            <div className="mb-4">
              <label className="block mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={
                  editFormData.date
                    ? new Date(editFormData.date)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={handleEditChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>

            {/* Time Input */}
            <div className="mb-4">
              <label className="block mb-1">Time</label>
              <input
                type="time"
                name="startTime"
                value={
                  editFormData.startTime
                    ? // If the startTime is an ISO string, convert it; otherwise, use it directly
                      editFormData.startTime.includes("T")
                        ? new Date(editFormData.startTime).toLocaleTimeString(
                            "en-GB",
                            {
                              hour12: false,
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : editFormData.startTime
                    : ""
                }
                onChange={handleEditChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateAppointment}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;