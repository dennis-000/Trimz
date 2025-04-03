// Importing React's StrictMode, which helps with highlighting potential issues in the app
import { StrictMode } from 'react';

// Importing React's new createRoot API to manage the React app's rendering
import { createRoot } from 'react-dom/client';

// Importing the main App component, which contains the structure of your application
import App from './App.jsx';

// Importing global styles from the index.css file
import './index.css';

// Importing BrowserRouter from react-router-dom to handle routing in the app
import { BrowserRouter } from 'react-router-dom';

// Importing toast notifications
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

// Importing the merged AuthContextProvider that now includes notification functionality
import { AuthContextProvider } from './context/AuthContext.jsx';

// Rendering the root element of the React app into the 'root' DOM element
createRoot(document.getElementById('root')).render(
  // Wrapping the app in StrictMode to check for potential problems
  <StrictMode>
    {/* Wrapping the app with BrowserRouter to enable routing in the app */}
    <BrowserRouter>
      <AuthContextProvider>
        <ToastContainer 
          theme='dark'
          position='top-right' 
          autoClose={3000} 
          closeOnClick 
          pauseOnHover={false}
        />
        <App /> {/* The main App component that contains the app's layout and routes */}
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);