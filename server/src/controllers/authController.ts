import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User-mysql';

// In-memory storage for profile updates (TODO: Migrate to database users table phone/address columns)
// This should persist to the users table instead of being in-memory
const profileStorage: Record<number, any> = {
    1: {
        phone: '',
        address: ''
    }
};

// Default admin credentials from environment variables
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Check against default admin credentials (configured via environment)
        // TODO: In production, use bcrypt to hash passwords and compare against database
        if (email === DEFAULT_ADMIN_EMAIL && password === DEFAULT_ADMIN_PASSWORD) {
            // Generate JWT token
            const token = jwt.sign(
                { id: 1, email: DEFAULT_ADMIN_EMAIL, role: 'admin' },
                process.env.JWT_SECRET || 'fallback-secret',
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Login successful',
                user: {
                    id: 1,
                    email: DEFAULT_ADMIN_EMAIL,
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
    const userId = (req as any).user?.id || 1;
    const storedProfile = profileStorage[userId] || { phone: '', address: '' };
    
    // TODO: Fetch user details from database instead of hardcoding
    res.json({ 
        success: true,
        data: {
            phone: storedProfile.phone || '',
            address: storedProfile.address || ''
        },
        user: {
            id: userId,
            email: DEFAULT_ADMIN_EMAIL,
            name: 'Administrator',
            role: 'admin',
            created_at: new Date().toISOString()
        }
    });
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone, address } = req.body;
        const userId = (req as any).user?.id || 1;
        
        console.log('Update profile request:', { userId, name, email, hasPassword: !!password });
        
        if (!userId) {
            return res.status(401).json({ 
                success: false,
                error: 'User not authenticated'
            });
        }
        
        // TODO: Persist phone and address to database users table instead of in-memory storage
        profileStorage[userId] = {
            phone: phone || '',
            address: address || ''
        };
        
        console.log('Profile updated in storage:', profileStorage[userId]);
        
        // Return success with the updated data
        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: userId,
                email: email || DEFAULT_ADMIN_EMAIL,
                name: name || 'Administrator',
                role: 'admin',
                phone: phone || '',
                address: address || '',
                created_at: new Date().toISOString()
            },
            data: {
                phone: phone || '',
                address: address || ''
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
