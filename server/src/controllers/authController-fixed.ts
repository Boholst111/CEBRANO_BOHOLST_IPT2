import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../database/database';

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        console.log('🔍 Login attempt for username:', username);

        // Find user by username using direct database query
        const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
        const user = stmt.get(username) as any;
        
        console.log('👤 User found:', user ? 'YES' : 'NO');
        
        if (!user) {
            console.log('❌ User not found in database');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log('🔐 Checking password...');
        
        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        
        console.log('Password valid:', isValidPassword ? '✅ YES' : '❌ NO');
        
        if (!isValidPassword) {
            console.log('❌ Password mismatch');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log('✅ Login successful! Generating token...');

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        // Return user info (without password) and token
        const { password_hash, ...userInfo } = user;
        
        console.log('✅ Sending successful response');
        
        res.json({
            message: 'Login successful',
            user: userInfo,
            token
        });
    } catch (error) {
        console.error('❌ Login error:', error);
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
