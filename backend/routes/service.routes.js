import { Router } from "express";
import { createNewService, deleteService, getAllServices, getSingleService, updateService } from "../controllers/service.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const serviceRouter = Router()

//Service
serviceRouter.get("/", getAllServices)
serviceRouter.get("/:id", getSingleService) //Get a single service
serviceRouter.post("/", requireAuth, createNewService)
serviceRouter.patch("/:id", requireAuth, updateService)
serviceRouter.delete("/:id", requireAuth, deleteService)

export default serviceRouter