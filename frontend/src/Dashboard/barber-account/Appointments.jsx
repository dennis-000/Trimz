/* eslint-disable react/prop-types */
import { formateDate } from "../../utils/formateDate";
import { useState } from "react";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";

const Appointments = ({ appointments, refreshAppointments }) => {
  // State to track which appointment's dropdown is open
  const [dropdownOpenId, setDropdownOpenId] = useState(null);

  // Function to update appointment status or paymentStatus
  const updateAppointmentStatus = async (appointmentId, updateFields) => {
    try {
      const jwt = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}appointments/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(updateFields),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      toast.success("Appointment updated successfully");
      if (refreshAppointments) refreshAppointments();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handler for cancel action
  const handleCancel = (appointmentId) => {
    updateAppointmentStatus(appointmentId, { status: "cancelled" });
    setDropdownOpenId(null);
  };

  // Handler for complete action
  const handleComplete = (appointmentId) => {
    updateAppointmentStatus(appointmentId, { status: "completed" });
    setDropdownOpenId(null);
  };

  // Handler for marking payment as paid
  const handleMarkAsPaid = (appointmentId) => {
    updateAppointmentStatus(appointmentId, { paymentStatus: "paid" });
    setDropdownOpenId(null);
  };

  // Toggle dropdown for a specific appointment
  const toggleDropdown = (appointmentId) => {
    setDropdownOpenId((prevId) => (prevId === appointmentId ? null : appointmentId));
  };

  return (
    <div className="w-full overflow-x-auto shadow-md sm:rounded-lg">
      <div className="min-w-full p-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Appointments</h2>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Client</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Price</th>
                <th scope="col" className="px-6 py-3">Payment</th>
                <th scope="col" className="px-6 py-3">Time</th>
                <th scope="col" className="px-6 py-3">Duration</th>
                <th scope="col" className="px-6 py-3">Mobile</th>
                <th scope="col" className="px-6 py-3">Services</th>
                <th scope="col" className="px-6 py-3">Scheduled Date</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((item) => (
                <tr key={item._id} className="bg-white border-b hover:bg-gray-50 relative">
                  <th scope="row" className="flex items-center px-6 py-4 text-gray-900">
                  <img
                    src={item.customer.profilePicture?.url || "/default-profile.png"}
                    className="w-10 h-10 rounded-full object-cover"
                    alt="Client"
                    />
                    <div className="pl-3">
                      <div className="text-base font-semibold">{item.customer.name}</div>
                      <div className="text-sm text-gray-500">{item.customer.email}</div>
                    </div>
                  </th>
                  <td className="px-6 py-4">{item.status}</td>
                  <td className="px-6 py-4">{item.totalPrice}</td>
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
                  <td className="px-6 py-4">{item.duration} mins</td>
                  <td className="px-6 py-4">{item.customer.phone}</td>
                  <td className="px-6 py-4">
                    {item.providerServices.map((i) => i.name).join(", ")}
                  </td>
                  <td className="px-6 py-4">{formateDate(item.date)}</td>
                  <td className="px-6 py-3 relative">
                    <button
                      onClick={() => toggleDropdown(item._id)}
                      className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                    >
                      Actions
                    </button>
                    {dropdownOpenId === item._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
                        {/* Show Cancel if not already cancelled or completed */}
                        {item.status !== "cancelled" && item.status !== "completed" && (
                          <button
                            onClick={() => handleCancel(item._id)}
                            className="block w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-gray-100"
                          >
                            Cancel
                          </button>
                        )}
                        {/* Show Complete if not already completed or cancelled */}
                        {item.status !== "completed" && item.status !== "cancelled" && (
                          <button
                            onClick={() => handleComplete(item._id)}
                            className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                          >
                            Complete
                          </button>
                        )}
                        {/* Show Mark as Paid if paymentStatus is not 'paid' */}
                        {item.paymentStatus !== "paid" && (
                          <button
                            onClick={() => handleMarkAsPaid(item._id)}
                            className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                          >
                            Mark as Paid
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {appointments.map((item) => (
            <div key={item._id} className="bg-white p-4 rounded-lg shadow space-y-3 relative">
              <div className="flex items-center space-x-3">
              <img
                  src={item.customer.profilePicture?.url || "/default-profile.png"}
                  className="w-10 h-10 rounded-full object-cover"
                  alt="Client"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{item.customer.name}</h3>
                  <p className="text-sm text-gray-500">{item.customer.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="font-medium text-gray-500">Status</p>
                  <p>{item.status}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Price</p>
                  <p>{item.totalPrice}</p>
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
                  <p className="font-medium text-gray-500">Time</p>
                  <p>
                    {(new Date(item.startTime)).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Duration</p>
                  <p>{item.duration} mins</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Phone</p>
                  <p>{item.customer.phone}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Services</p>
                  <p>{item.providerServices.map((i) => i.name).join(", ")}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium text-gray-500">Scheduled Date</p>
                  <p>{formateDate(item.date)}</p>
                </div>
                <div className="col-span-2 flex justify-end gap-2">
                  <button
                    onClick={() => toggleDropdown(item._id)}
                    className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                  >
                    Actions
                  </button>
                  {dropdownOpenId === item._id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
                      {item.status !== "completed" && item.status !== "cancelled" && (
                        <button
                          onClick={() => handleComplete(item._id)}
                          className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                        >
                          Complete
                        </button>
                      )}
                      {item.paymentStatus !== "paid" && (
                        <button
                          onClick={() => handleMarkAsPaid(item._id)}
                          className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                        >
                          Mark as Paid
                        </button>
                      )}
                      {item.status !== "cancelled" && item.status !== "completed" && (
                        <button
                          onClick={() => handleCancel(item._id)}
                          className="block w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {appointments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No appointments found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;