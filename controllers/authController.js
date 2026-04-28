import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ firstName, lastName, email, password: hashed });

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1d' });

    const { password: _, ...userWithoutPassword } = newUser._doc;

    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
      token
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (user.provider === 'google') {
      return res.status(400).json({
        message: "Please login using Google"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { email, given_name, family_name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        firstName: given_name,
        lastName: family_name,
        password: null,
        provider: 'google'
      });
    }

    const jwtToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({
      message: "Google authentication successful",
      user,
      token: jwtToken
    });

  } catch (err) {
    console.error("Google auth error:", err);
    res.status(401).json({ message: "Google authentication failed" });
  }
};

export const logoutUser = async (req, res) => {
  // Frontend typically handles logout by clearing token
  res.json({ message: "Logout successful" });
};
