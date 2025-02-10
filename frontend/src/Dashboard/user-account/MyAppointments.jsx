import Loader from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";
import { BASE_URL } from "../../config";
import { useEffect, useState } from "react";
import Appointments from "./Appointment";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    const url = `${BASE_URL}appointments/user`;

    // Check if URL is valid
    if (!url || url.includes("undefined")) {
      setLoading(false);
      setError({ message: "Invalid URL provided." });
      return;
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Parse the response once
      const result = await response.json();
      console.log("Fetched result:", result);

      if (!response.ok) {
        const errorMessage = result?.message || `Error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      // Normalize the data:
      // If result.data exists and is an array, use it;
      // otherwise, if result itself is an array, use that;
      // else, default to an empty array.
      const fetchedAppointments = result.data && Array.isArray(result.data)
        ? result.data
        : Array.isArray(result)
          ? result
          : [];
      console.log("Appointments:", fetchedAppointments);
      setAppointments(fetchedAppointments);
    } catch (err) {
      setError({ message: err.message, stack: err.stack });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Determine if there are no appointments
  const isNoAppointments =
    !loading &&
    (!appointments || (Array.isArray(appointments) && appointments.length === 0));

  return (
    <div>
      {loading && !error && <Loader />}

      {error && !loading && <Error errMessage={error.message} />}

      {!loading && !error && appointments.length > 0 && (
        <div className="">
          <Appointments appointments={appointments} refreshAppointments={fetchAppointments} />
        </div>
      )}

      {!loading && !error && isNoAppointments && (
        <h2 className="mt-5 text-center leading-7 text-[20px] font-semibold text-primaryColor">
          You have not made any appointments
        </h2>
      )}
    </div>
  );
};

export default MyAppointments;