import { Router } from 'express'
import {
    getUserProfile,
    createNewUser,
    deleteUser,
    getAllCustomers,
    getAllProviders,
    getAllUsers,
    getSingleUserById,
    updateUser
} from '../controllers/user.controller.js'
import upload from '../config/upload.config.js';
import { requireAuth, restrict } from '../middlewares/auth.middleware.js';
// import { getMyAppointments } from '../controllers/appointment.controller.js';

const userRouter = Router()

//Users
userRouter.get("/", getAllUsers)
userRouter.get("/providers", getAllProviders) //Get all providers
userRouter.get("/customers", getAllCustomers) //Get all customers
userRouter.get("/:id", getSingleUserById) //Get a single user
userRouter.post("/", upload.single("profilePicture"), createNewUser)
userRouter.patch("/:id", requireAuth, upload.single("profilePicture"), updateUser)// Single profile picture), updateUser)
userRouter.delete("/:id", requireAuth, deleteUser)

//get all appointments on the user dashboard
userRouter.get("/profile/me", requireAuth, restrict(["user"]), getUserProfile);
// userRouter.get("/appointments/my-appointments", requireAuth, restrict(["user"]), getMyAppointments);

export default userRouter;