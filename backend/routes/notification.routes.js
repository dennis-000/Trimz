import { Router } from 'express';
import Appointment from '../models/appointment.model.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const notificationRouter = Router();

// Get unread notifications for provider - protected route
// notificationRouter.get('/:providerId', requireAuth, async(req, res) => {
//     try {
//         // Add validation to ensure the user is requesting their own notifications
//         if (req.user._id.toString() !== req.params.providerId) {
//             return res.status(403).json({ 
//                 success: false, 
//                 message: 'Unauthorized access to notifications' 
//             });
//         }
//         try {
//         const notifications = await Appointment.find({
//                 provider: req.params.providerId,
//                 notificationStatus: 'unread'
//             })
//             .populate('customer', 'name')
//             .populate('service', 'name');
//         }catch(err) {
//             console.error('Error fetching notifications:', err);
//             res.status(500).json({ 
//                 success: false, 
//                 error: err.message
//             });
//         }
            
//         res.status(200).json({
//             success: true, 
//             data: notifications, 
//             message: 'Unread notifications fetched successfully'
//         });
//     } catch (err) {
//         console.error('Error fetching notifications:', err);
//         res.status(500).json({ 
//             success: false, 
//             error: err.message 
//         });
//     }
// });

// Mark notification as read - protected route
notificationRouter.patch('/:id', requireAuth, async(req, res) => {
    try {
        // Find the notification first to verify ownership
        const notification = await Appointment.findById(req.params.id);
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }
        
        // Ensure the provider is updating their own notification
        if (notification.provider.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to update this notification'
            });
        }

        await Appointment.findByIdAndUpdate(req.params.id, { notificationStatus: 'read' });
        
        res.status(200).json({ 
            success: true,
            message: 'Notification marked as read' 
        });
    } catch (err) {
        console.error('Error marking notification as read:', err);
        res.status(500).json({ 
            success: false, 
            error: err.message
        });
    }
});

export default notificationRouter;