import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { createAuditLog } from "./audit.controller.js";
import sendEmail from "../config/mail.config.js";
import { hashPassword } from "../server.js";


//Generate jwt
const createToken = (id) => {
    const JWT_SECRET = process.env.JWT_SECRET
    console.log('JWT_SECRET:', process.env.JWT_SECRET); // Should print the secret key if loaded correctly
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in the environment variables");
    }
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: '1d' })
}

export const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email })

        if(!user){
            return res.status(401).json({success: false, message: "Invalid email or password"})
        }
        
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(401).json({success: false, message: "Invalid email or password"})
        }

        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 })
        console.log(`User ${ email } logged in successfully`);
        res.status(200).json({ success: true, message: 'Login successfully', token , data: user })
    } catch (error) {
        console.log(`Server Error: ${ error.message }`);
        return res.status(500).json({ success: false, message: `Server Error: ${error.message}` })
    }
}

export const logout = async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 }); // Clears the JWT cookie
    res.status(200).json({ success: true, message: 'Logged out successfully' });
}

export const forgotPasswordController = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Generate a unique token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Save the hashed token and expiration to the user's record
        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        // Create a reset URL
        const resetUrl = `${req.get('origin')}/reset-password/${resetToken}`;

        let message = `You recently requested to reset your password. Click the link below to reset it:\n\n${resetUrl}`;
        let html = `<!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              color: #333;
              padding: 20px;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 20px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              font-size: 24px;
              font-weight: bold;
              color: #0066ff;
              margin-bottom: 20px;
              text-align: center;
            }
            .content {
              font-size: 16px;
              line-height: 1.6;
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #0066ff;
              color: #ffffff;
              text-decoration: none;
              font-size: 16px;
              font-weight: bold;
              border-radius: 4px;
              margin-top: 20px;
            }
            .footer {
              margin-top: 30px;
              font-size: 14px;
              color: #666;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">Password Reset Request</div>
            <div class="content">
              <p>Hello ${user.name},</p>
              <p>You recently requested to reset your password. Click the button below to reset it:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p>If you did not request this, please ignore this email or contact support if you have concerns.</p>
              <p>For your security, this link will expire in <em><b>15 minutes.</b></em></p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Ecutz. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
        // Send email
        const emailResult = await sendEmail({
            receipient: user.email,
            subject: 'Password Reset Request',
            message,
            html
        });

        // Check emailResult for success
        if (emailResult.accepted && emailResult.accepted.includes(user.email)) {
            res.status(200).json({
                success: true,
                message: "Password reset link sent to email.",
                resetUrl
            });
        } else {
            res.status(500).json({
                success: false,
                message: "Failed to send email. Please try again later.",
                error: emailResult.response || "Unknown error",
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
    }
};

export const resetPasswordController = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        // Hash the received token to match stored hash
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with matching reset token and check expiration
        const user = await User.findOne({
            resetPasswordToken: tokenHash,
            resetPasswordExpires: { $gt: Date.now() }, // Check token validity
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token." });
        }

        // Update the user's password   
        user.password = await hashPassword(password);
        user.resetPasswordToken = undefined; // Clear the reset token
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ success: true, message: "Password updated successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
    }
};