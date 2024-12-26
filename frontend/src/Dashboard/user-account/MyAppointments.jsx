import useFetchData from "../../hooks/useFetchData"
import { BASE_URL } from "../../config"
import BarberCard from "../../components/Barbers/BarberCard";
import Loading from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";

const MyAppointments = () => {
  const { data: appointments, loading, error } = useFetchData(`${BASE_URL}appointments/all`);
  
  console.log('Appointments Data:', { appointments, loading, error });

  // If error is specifically "Appointment not found", treat it as no appointments
  const isNoAppointments = 
  error?.message === "Appointment not found" || 
  error === "Appointment not found";

  return (
    <div>
      {loading && !error && <Loading/>}

      {/* If there's a generic error and it's not the "no appointments" case, show the error */}
      { error && !isNoAppointments && !loading && <Error errMessage={error}/>}

      {!loading && !error && appointments && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {appointments.map(appointment=> (
            <BarberCard key={appointment._id} barber={appointment}/>
          ))}
        </div>
      )}

      {/* Show "no appointments" message when there are no appointments or on specific "not found" error */}
      {((!loading && !error && (!appointments || appointments.length === 0)) || 
        isNoAppointments) && (
        <h2 className="mt-5 text-center leading-7 text-[20px] font-semibold 
        text-primaryColor">
          You have not made any appointments
        </h2>
      )}
    </div>
  )
}

export default MyAppointments;