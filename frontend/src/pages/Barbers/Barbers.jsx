import { useState, useEffect } from "react";
import BarberCard from "../../components/Barbers/BarberCard";
import Testimonial from "../../components/Testimonial/Testimonial";
import { BASE_URL } from "./../../config";
import Loader from "../../components/Loading/Loading.jsx";
import Error from "../../components/Error/Error";

const Barbers = () => {
  // State for the search input and provider data
  const [query, setQuery] = useState("");
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch providers on component mount
  useEffect(() => {
    const fetchProviders = async () => {
      const url = `${BASE_URL}users/providers`;
      try {
        const response = await fetch(url, { method: "GET" });
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();
        // Assume the API returns data under result.data or directly an array
        const data = result.data && Array.isArray(result.data) ? result.data : result;
        setProviders(data);
        setFilteredProviders(data);
      } catch (err) {
        setError({ message: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  // Filter providers based on the query input (search on the frontend)
  useEffect(() => {
    if (query.trim() === "") {
      setFilteredProviders(providers);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = providers.filter((provider) => {
        // Assuming provider.name and provider.specialization (or specialization.title) exist
        const nameMatches = provider.name && provider.name.toLowerCase().includes(lowerQuery);
        // Check for specialization if available (you might need to adjust depending on your model)
        const specializationMatches =
          provider.specialization &&
          ((typeof provider.specialization === "string" &&
            provider.specialization.toLowerCase().includes(lowerQuery)) ||
           (provider.specialization.title &&
            provider.specialization.title.toLowerCase().includes(lowerQuery)));
        return nameMatches || specializationMatches;
      });
      setFilteredProviders(filtered);
    }
  }, [query, providers]);

  // Update query state on input change
  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  return (
    <>
      <section className="bg-[#fff9ea]">
        <div className="container text-center">
          <h2 className="heading">Discover and Book Services Stylists</h2>
          <div className="max-w-[570px] mt-[30px] mx-auto bg-[#0066ff2c] rounded-md flex items-center justify-between">
            <input
              type="search"
              className="py-4 pl-4 pr-2 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor"
              placeholder="Search Barber/Stylists by name or specialization"
              value={query}
              onChange={handleSearch}
            />
            {/* You can optionally keep a Search button, but it's not strictly necessary */}
            <button className="btn mt-0 rounded-[0px] rounded-r-md" onClick={() => {}}>
              Search
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          {loading && <Loader />}
          {error && <Error errMessage={error.message} />}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredProviders.map((provider) => (
                // Use a unique key such as _id
                <BarberCard key={provider._id} user={provider} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="container">
          <div className="xl:w-[470px] mx-auto">
            <h2 className="heading text-center">What our clients say</h2>
            <p className="text__para text-center">
              At Ecutz, we pride ourselves on delivering top-notch barbering services to students right on campus.
            </p>
          </div>
          <Testimonial />
        </div>
      </section>
    </>
  );
};

export default Barbers;