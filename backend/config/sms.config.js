import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const HUBTEL_BASE_URL = process.env.HUBTEL_BASE_URL || 'https://smsc.hubtel.com/v1/messages/send';

/**
 * Send SMS via Hubtel
 * @param {Object} params
 * @param {string} params.to - Recipient phone number in international format
 * @param {string} params.content - Message content
 * @param {string} [params.from] - Sender ID (falls back to HUBTEL_FROM)
 */
const sendSms = async ({ to, content, from }) => {
  const username = process.env.HUBTEL_CLIENT_ID;
  const password = process.env.HUBTEL_CLIENT_SECRET;
  const sender = from || process.env.HUBTEL_FROM;

  if (!username || !password || !sender) {
    throw new Error('Hubtel SMS not configured. Please set HUBTEL_CLIENT_ID, HUBTEL_CLIENT_SECRET, and HUBTEL_FROM.');
  }

  if (!to || !content) {
    throw new Error('Missing required parameters: to, content');
  }

  try {
    const response = await axios.post(
      HUBTEL_BASE_URL,
      null,
      {
        params: {
          From: sender,
          To: to,
          Content: content,
        },
        auth: {
          username,
          password,
        },
        timeout: 10000,
      }
    );

    return response.data;
  } catch (err) {
    console.error('Hubtel SMS error:', err.response?.data || err.message);
    throw new Error(err.response?.data || err.message);
  }
};

export default sendSms;
