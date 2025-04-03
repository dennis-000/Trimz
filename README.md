## Zeal Craft Innovation Developers Team
# Trimz

## Trimz Website
Trimz is a barbering service booking app designed for students at the University of Ghana, Legon. This app allows students to book individual barbers for on-demand, personalized barbering services. Barbers are registered on the platform, allowing students to browse profiles and book their preferred barber based on availability.

## Features
- **Customer Registration & Login**: Students can create an account, log in, and manage their profile.
- **Barber Listing**: Registered barbers are displayed, and students can book appointments with specific barbers.
- **Appointment Scheduling**: Students can easily schedule barbering appointments.
- **Responsive Design**: The mobile-friendly app works seamlessly across different devices.
- **AND OTHERS**

## Tech Stack
This project is built using the MERN stack:

- **MongoDB**: NoSQL database for storing customer, barber, and appointment data.
- **Express.js**: Backend framework for handling API requests and routing.
- **React**: The frontend framework is used to build the customer interface.
- **Node.js**: JavaScript runtime environment for the server-side application.

## Project Structure
```bash
/frontend
    /client            # Frontend React application
    /public          # Static assets (index.html, images, etc.)
    /src             # React components and application logic
        /assets        # Images, logos, etc.        # Routes configuration for page navigation
        /components    # Header, Footer, and UI components
        /layout        # Layout components for organizing page structure
        /pages
        /routes         # Different pages (Home, Services, Contact, Login)
    /styles          # Tailwind CSS and custom styling

/Backend
    /server          # Backend Node.js application
    /models          # MongoDB models (Customer, Barber, Appointment)
    /routes          # API routes (customer, barber, appointment routes)
    /controllers     # Logic for handling requests to the routes
    /config          # Database connection and environment configuration
    /middlewares     # Middleware functions (authentication, error handling)
```
## Installation and Setup

### Prerequisites
Ensure you have the following installed:
- **Node.js**: [Download Node.js](https://nodejs.org/)
- **MongoDB**: [Install MongoDB](https://www.mongodb.com/)

### Backend Setup (Server)
1. Clone the repository:
    ```bash
    git clone https://github.com/dennis-000/Trimz.git
    cd Trimz/server
    ```
2. Install backend dependencies:
    ```bash
    npm install
    ```
3. Set up environment variables:
    Create a `.env` file in the `server/` directory and add the following:
    ```makefile
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key
    PORT=5000
    ```
4. Run the backend server:
    ```bash
    npm start
    ```
    The backend server will run on [http://localhost:5000](http://localhost:5000).

### Frontend Setup (Client)
1. Navigate to the `client/` directory:
    ```bash
    cd ../client
    ```
2. Install frontend dependencies:
    ```bash
    npm install
    ```
3. Run the frontend development server:
    ```bash
    npm run dev
    ```
    The frontend server will run on [http://localhost:3000](http://localhost:3000).

## Usage
Once both the frontend and backend are running:
- Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to access the Trimz app.
- You can register as a customer or a barber.
- Barbers can manage their appointments, and students can book barbering services based on the barbers' availability.

## API Endpoints

### Customer Routes
- **POST** `/api/customers/register`: Register a new customer.
- **POST** `/api/customers/login`: Log in as a customer.

### Barber Routes
- **GET** `/api/barbers`: Retrieve a list of all registered barbers.
- **POST** `/api/barbers/register`: Register a new barber.

### Appointment Routes
- **POST** `/api/appointments`: Book an appointment with a barber.
- **GET** `/api/appointments/customer/:customerId`: Retrieve appointments for a specific customer.

## Production Build
To build the app for production:
1. In the `client/` folder, run the following to build the production version of the frontend:
    ```bash
    npm run build
    ```
    The `build/` folder will contain the production files, which you can serve from a static hosting platform or integrate with the backend.

2. Deploy the backend and configure it to serve the static frontend files and handle API requests.

## License
This project is developed and maintained by Zeal Craft Innovation, Pentecost University
