import express from 'express';
import Appointment from '../models/appointment.model.js';

const router = express.Router();

// Get unread notifications for provider
router.get('/:providerId', async(req, res) => {
    try {
        const notifications = await Appointment.find({
                provider: req.params.providerId,
                notificationStatus: 'unread'
            })
            .populate('customer', 'name') // Populate customer name
            .populate('service', 'name'); // Populate service name
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Mark notification as read
router.put('/:id', async(req, res) => {
    try {
        await Appointment.findByIdAndUpdate(req.params.id, { notificationStatus: 'read' });
        res.json({ message: 'Notification marked as read' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;