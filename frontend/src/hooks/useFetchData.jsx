import { useEffect, useState } from "react";

const useFetchData = (url) => {
  const [data, setData] = useState(null); // Start with `null` to indicate no data yet
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset states
    setError(null);
    setLoading(true);

    // Check if URL is valid
    if (!url || url.includes("undefined")) {
      setLoading(false);
      setError({ message: "Invalid URL provided." });
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
        });

        if (!response.ok) {
            let errorMessage = `Error: ${response.status} ${response.statusText}`;
            try {
              const errorBody = await response.json();
              errorMessage = errorBody?.message || errorMessage;
            // eslint-disable-next-line no-unused-vars
            } catch (parseError) {
              // If response is not JSON, use the default error message
            }
            throw new Error(errorMessage);
          }

        const result = await response.json();
        setData(result.data || result); // Handle both `{ data: ... }` and direct array/object responses
      } catch (err) {
        setError({ message: err.message, stack: err.stack });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useFetchData;
