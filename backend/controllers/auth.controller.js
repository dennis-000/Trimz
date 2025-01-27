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
        const resetUrl = `${req.protocol}://${req.get('origin')}/reset-password/${resetToken}`;

        // Send email
        const emailResult = await sendEmail({
            receipients: [user.email],
            subject: 'Password Reset Request',
            message: `You requested a password reset. Use this link: ${resetUrl}`
        });

        res.status(200).json({ success: true, message: "Password reset link sent to email.", emailResult, resetUrl });
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