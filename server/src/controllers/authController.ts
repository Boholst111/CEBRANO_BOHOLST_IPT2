import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Simple mock authentication - accept admin@example.com with password
        if (email === 'admin@example.com' && password === 'password') {
            // Generate JWT token
            const token = jwt.sign(
                { id: 1, email: 'admin@example.com', role: 'admin' },
                process.env.JWT_SECRET || 'fallback-secret',
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Login successful',
                user: {
                    id: 1,
                    email: 'admin@example.com',
                    name: 'Administrator',
                    role: 'admin'
                },
                token
            });
        } else {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
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
    // Return mock user profile
    res.json({ 
        user: {
            id: 1,
            email: 'admin@example.com',
            name: 'Administrator',
            role: 'admin'
        }
    });
};
