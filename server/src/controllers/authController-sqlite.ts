import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = UserModel.findByUsername(username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        // Return user info (without password) and token
        const { password_hash, ...userInfo } = user;
        res.json({
            message: 'Login successful',
            user: userInfo,
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const logout = (req: Request, res: Response) => {
    // In a stateless JWT system, logout is handled client-side
    res.json({ message: 'Logout successful' });
};

export const getProfile = (req: Request, res: Response) => {
    const { password_hash, ...userInfo } = req.user;
    res.json({ user: userInfo });
};
