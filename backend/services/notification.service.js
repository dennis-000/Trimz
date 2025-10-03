import sendEmail from '../config/mail.config.js';
import sendSms from '../config/sms.config.js';

/**
 * Send appointment notifications via Email and SMS to customer and provider
 * @param {Object} params
 * @param {import('../models/appointment.model.js').default} params.appointment
 * @param {import('../models/user.model.js').default} params.customer
 * @param {import('../models/user.model.js').default} params.provider
 */
export const sendAppointmentNotifications = async ({ appointment, customer, provider }) => {
  const errors = [];

  const dateStr = new Date(appointment.startTime).toLocaleString();
  const apptId = appointment._id.toString();

  // Email content
  const subject = `New Appointment - ${dateStr}`;
  const message = `Appointment booked for ${dateStr}.`;
  const html = `<!DOCTYPE html>
  <html>
  <body style="font-family: Arial, sans-serif;">
    <h2 style="color:#111">Trimz Booking Confirmation</h2>
    <p><b>Date/Time:</b> ${dateStr}</p>
    <p><b>Status:</b> ${appointment.status}</p>
    <p><b>Appointment ID:</b> ${apptId}</p>
  </body>
  </html>`;

  // Provider Email
  if (provider?.email) {
    try {
      await sendEmail({ receipient: provider.email, subject, message, html });
    } catch (e) {
      errors.push(`Provider email failed: ${e.message}`);
    }
  }

  // Customer Email
  if (customer?.email) {
    try {
      await sendEmail({ receipient: customer.email, subject, message, html });
    } catch (e) {
      errors.push(`Customer email failed: ${e.message}`);
    }
  }

  // SMS content
  const smsText = `Trimz: Appointment ${dateStr}. ID: ${apptId}.`;

  // Provider SMS
  if (provider?.phone) {
    try {
      await sendSms({ to: provider.phone, content: smsText });
    } catch (e) {
      errors.push(`Provider SMS failed: ${e.message}`);
    }
  }

  // Customer SMS
  if (customer?.phone) {
    try {
      await sendSms({ to: customer.phone, content: smsText });
    } catch (e) {
      errors.push(`Customer SMS failed: ${e.message}`);
    }
  }

  return { ok: errors.length === 0, errors };
};
