/* eslint-disable react/prop-types */
import { formateDate } from "../../utils/formateDate"

const Appointments = ({ appointments }) => {
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
                <th scope="col" className="px-6 py-3">Gender</th>
                <th scope="col" className="px-6 py-3">Payment</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Mobile</th>
                <th scope="col" className="px-6 py-3">Services</th>
                <th scope="col" className="px-6 py-3">Scheduled date</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map(item => (
                <tr key={item._id} className="bg-white border-b hover:bg-gray-50">
                  <th scope="row" className="flex items-center px-6 py-4 text-gray-900">
                    <img src={item.user.profilePicture} className="w-10 h-10 rounded-full object-cover" alt="" />
                    <div className="pl-3">
                      <div className="text-base font-semibold">{item.user.name}</div>
                      <div className="text-sm text-gray-500">{item.user.email}</div>
                    </div>
                  </th>
                  <td className="px-6 py-4">{item.user.gender}</td>
                  <td className="px-6 py-4">
                    {item.isPaid ? (
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
                  <td className="px-6 py-4">{item.user.email}</td>
                  <td className="px-6 py-4">{item.user.phone}</td>
                  <td className="px-6 py-4">{item.user.services}</td>
                  <td className="px-6 py-4">{formateDate(item.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {appointments.map(item => (
            <div key={item._id} className="bg-white p-4 rounded-lg shadow space-y-3">
              <div className="flex items-center space-x-3">
                <img src={item.user.profilePicture} className="w-12 h-12 rounded-full object-cover" alt="" />
                <div>
                  <h3 className="font-semibold text-gray-900">{item.user.name}</h3>
                  <p className="text-sm text-gray-500">{item.user.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="font-medium text-gray-500">Gender</p>
                  <p>{item.user.gender}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Payment</p>
                  {item.isPaid ? (
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
                  <p>{item.user.phone}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Services</p>
                  <p>{item.user.services}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium text-gray-500">Scheduled Date</p>
                  <p>{formateDate(item.createdAt)}</p>
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
    </div>
  )
}

export default Appointments