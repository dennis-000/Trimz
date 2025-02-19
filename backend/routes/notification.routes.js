import { Router } from 'express'
import Appointment from '../models/appointment.model.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const notificationRouter = Router();

// Get unread notifications for provider
notificationRouter.get('/:providerId', async(req, res) => {
    try {
        const notifications = await Appointment.find({
                provider: req.params.providerId,
                notificationStatus: 'unread'
            })
            .populate('customer', 'name') // Populate customer name
            .populate('service', 'name'); // Populate service name
        res.status(200).json({success: true, data: notifications, message: 'Unread notifications fetched successfully'});
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Mark notification as read
notificationRouter.patch('/:id', async(req, res) => {
    try {
        await Appointment.findByIdAndUpdate(req.params.id, { notificationStatus: 'read' });
        res.status(200).json({ message: 'Notification marked as read' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message, message: err.message });
    }
});

export default notificationRouter;