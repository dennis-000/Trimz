import { BsCheckCircle } from "react-icons/bs";
import { motion } from "framer-motion";

const ThankYou = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center"
      >
        <BsCheckCircle className="text-green-500" size={60} />
        <h2 className="text-2xl font-semibold mt-4 text-gray-800">
          Thank You for Booking!
        </h2>
        <p className="text-gray-600 mt-2 text-center">
          Your appointment has been confirmed. We appreciate your trust in us.
        </p>
        <button
          onClick={() => window.location.href = "/"} // Adjust if using react-router
          className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Back to Home
        </button>
      </motion.div>
    </div>
  );
};

export default ThankYou;
