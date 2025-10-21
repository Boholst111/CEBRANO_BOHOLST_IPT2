const express = require('express');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
app.use(express.json());

// Simple login endpoint for debugging
app.post('/debug-login', async (req, res) => {
    try {
        console.log('🔍 Debug login request received');
        console.log('Body:', req.body);
        
        const { username, password } = req.body;
        
        if (!username || !password) {
            console.log('❌ Missing username or password');
            return res.status(400).json({ error: 'Username and password required' });
        }
        
        // Connect to database
        const dbPath = path.join(__dirname, '../database/sfms.db');
        const db = new Database(dbPath);
        
        // Find user
        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
        console.log('👤 User found:', user ? 'YES' : 'NO');
        
        if (!user) {
            console.log('❌ User not found in database');
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        console.log('🔐 Checking password...');
        console.log('Input password:', password);
        console.log('Stored hash:', user.password_hash);
        
        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        console.log('Password valid:', isValidPassword ? '✅ YES' : '❌ NO');
        
        if (!isValidPassword) {
            console.log('❌ Password mismatch');
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        console.log('✅ Login successful!');
        
        db.close();
        
        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
        
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = 5002;
app.listen(PORT, () => {
    console.log(`🔍 Debug server running on port ${PORT}`);
    console.log(`Test with: POST http://localhost:${PORT}/debug-login`);
});
