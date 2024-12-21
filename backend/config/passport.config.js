import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import dotenv from 'dotenv'
import { createAuditLog } from '../controllers/audit.controller.js';

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET;

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/api/auth/google/callback',
    passReqToCallback: true,
  },
  async (request, accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.email });
      // let user = await User.findOne({ googleId: profile.id, email: profile.email });

      // If user doesn't exist, create a new user
      if (!user) {
        // Upload profile picture to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profile.picture, {
          folder: 'profilePictures',
          public_id: `google_${profile.id}`,
        });

        user = await User.create({
          googleId: profile.id,
          email: profile.email,
          name: profile.displayName,
          profilePicture: {
            url: uploadResponse.secure_url,
            public_id: uploadResponse.public_id,
          },
        });
      }else if (!user.googleId) {
        // If the user exists but doesn't have a googleId, add it
        user.googleId = profile.id;
        await user.save();
      }

      // Generate a JWT token for the user
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
      await createAuditLog("Google Auth", user._id, "User", "login", "User logged in via google"); //Log user creation
      done(null, { token, user });
    } catch (error) {
      done(error, false);
    }
  }
));

passport.serializeUser((data, done) => {
  done(null, data.token);
});

passport.deserializeUser((token, done) => {
  done(null, token);
});
