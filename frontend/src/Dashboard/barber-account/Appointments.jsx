/* eslint-disable react/prop-types */
import {formateDate} from "../../utils/formateDate"
const Appointments = ({appointments}) => {
  return (
    <table className="w-full text-left text-sm text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
                <th scope="col" className="px-6 py-3">
                    Client
                </th>
                <th scope="col" className="px-6 py-3">
                    Gender
                </th>
                <th scope="col" className="px-6 py-3">
                    Payment
                </th>
                <th scope="col" className="px-6 py-3">
                    Email
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
            </tr>
        </thead>

        <tbody>
            {appointments.map(item=> (
            <tr key={item._id}>
                
                <th 
                scope="row" 
                className="flex items-center px-6 py-4 text-gray-900 whitespaces-nowrap">
                    <img src={item.user.profilePicture} className="w-10 h-10 rounded-full" alt="" />
                    <div className="pl-3">
                        <div className="text-base font-semibold">
                            {item.user.name}
                        </div>
                        <div className="text-normal text-gray-500">
                            {item.user.email}
                        </div>
                    </div>
                </th>
                {/* gender */}
                <td className="px-6 py-4">{item.user.gender}</td>
                {/* Payment */}
                <td className="px-6 py-4">
                    {item.isPaid && (
                        <div className="flex items-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                        Paid
                        </div>
                        )}
                    {!item.isPaid && (
                        <div className="flex items-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                        Not Paid
                        </div>
                        )}
                </td>
                {/* Email  */}
                <td className="px-6 py-4">{item.user.email}</td>
                {/* Mobile Number */}
                <td className="px-6 py-4">{item.user.phone}</td>
                <td className="px-6 py-4">{item.user.services}</td>
                <td className="px-6 py-4">{formateDate(item.createdAt)}</td>
            </tr>
        ))}
        </tbody>
    </table>
  )
}

export default Appointments
