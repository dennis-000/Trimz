import { Router } from "express"
import { createNewProviderService, deleteProviderService, getAllProviderService, getAllProviderServicesByProviderId, getProviderProfile, getSingleProviderService, updateProviderService } from "../controllers/providerService.controller.js"
import { requireAuth, restrict } from "../middlewares/auth.middleware.js"
import upload from "../config/upload.config.js"

const providerServiceRouter = Router()

//Provider Service
providerServiceRouter.get("/", getAllProviderService)
providerServiceRouter.get("/:id", getSingleProviderService) //Get a single provider service
providerServiceRouter.get("/provider/:providerId", getAllProviderServicesByProviderId) //Get a single provider service
providerServiceRouter.post("/", requireAuth, upload.fields([{ name: 'providerServiceImage', maxCount: 10 }]), createNewProviderService)
providerServiceRouter.patch("/:id", requireAuth, upload.single('providerServiceImage'), updateProviderService)
providerServiceRouter.delete("/:id", requireAuth, deleteProviderService)

providerServiceRouter.get("/profile/me", requireAuth, restrict(['providers']), getProviderProfile);

export default providerServiceRouter