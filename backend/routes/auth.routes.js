import { Router } from "express";
import jwt from 'jsonwebtoken'
import passport from "passport";
import { forgotPasswordController, login, logout, resetPasswordController } from "../controllers/auth.controller.js";

const loginRouter = Router()

//Login and logout routes
loginRouter.post("/login", login)
loginRouter.get("/logout", logout)
loginRouter.post("/auth/forgot-password", forgotPasswordController)
loginRouter.post("/auth/reset-password/:token", resetPasswordController)
// Google OAuth2 login
loginRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account consent' }));
// Google OAuth2 callback
loginRouter.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:5173/register', session: false }), (req, res) => {
  const { token } = req.user;
  const { role } = req.user.user;
  res.cookie('jwt', token, { httpOnly: true });
  console.log(req.user);
  // res.status(200).json({ success: true, message: 'Login successful', token, data: req.user });
  res.redirect(`http://localhost:5173/${role == 'customer' ? 'users/profile/me' : 'barbers/profile/me'}?token=${token}&method=googleoauth`); // Redirect to dashboard after login
});

export default loginRouter