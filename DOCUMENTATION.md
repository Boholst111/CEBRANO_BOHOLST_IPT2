# Student & Faculty Management System - Documentation

## Overview

This is a comprehensive web-based management system for educational institutions to manage students and faculty members efficiently. The system provides a modern, responsive interface with full CRUD (Create, Read, Update, Delete) operations.

## Features

### 🎓 Student Management
- Add, view, edit, and delete student records
- Search and filter students by various criteria
- Track student information including:
  - Personal details (name, email, phone, address)
  - Academic information (program, year level, GPA)
  - Emergency contact information
  - Enrollment status and dates

### 👨‍🏫 Faculty Management
- Manage faculty member records
- Track faculty information including:
  - Personal and contact details
  - Employment information (hire date, position, department)
  - Salary and office location
  - Qualifications and specializations

### 📊 Dashboard & Analytics
- Overview statistics for students and faculty
- Visual charts showing distribution by programs and departments
- Quick action shortcuts
- Real-time data updates

### 🔐 Authentication & Security
- Secure JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Rate limiting and security headers

### 🎨 Modern UI/UX
- Responsive design that works on all devices
- Clean, professional interface using shadcn/ui components
- Dark/light mode support (via Tailwind CSS)
- Intuitive navigation and user experience

## Technology Stack

### Frontend
- **React 18** - Modern JavaScript library for building user interfaces
- **TypeScript** - Type-safe JavaScript development
- **TailwindCSS** - Utility-first CSS framework for styling
- **shadcn/ui** - High-quality, accessible UI components
- **Lucide React** - Beautiful, customizable icons
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server development
- **SQLite** - Lightweight, file-based database
- **better-sqlite3** - High-performance SQLite driver
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation middleware

## Installation

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Quick Setup

1. **Clone or download the project**
2. **Run the installation script:**
   - Windows: Double-click `install.bat`
   - macOS/Linux: Run `chmod +x install.sh && ./install.sh`
   - Manual: Run `npm run install-all`

3. **Start the application:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Manual Installation

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Return to root directory
cd ..

# Start development servers
npm run dev
```

## Default Login Credentials

- **Username:** admin
- **Password:** admin123

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Students
- `GET /api/students` - Get all students (with pagination and search)
- `POST /api/students` - Create new student
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/students/stats` - Get student statistics

### Faculty
- `GET /api/faculty` - Get all faculty members (with pagination and search)
- `POST /api/faculty` - Create new faculty member
- `GET /api/faculty/:id` - Get faculty by ID
- `PUT /api/faculty/:id` - Update faculty member
- `DELETE /api/faculty/:id` - Delete faculty member
- `GET /api/faculty/stats` - Get faculty statistics

## Database Schema

### Users Table
- Authentication and user management
- Stores hashed passwords and user roles

### Students Table
- Complete student information
- Academic and personal details
- Emergency contact information

### Faculty Table
- Faculty member details
- Employment and qualification information
- Department and position tracking

### Additional Tables
- Courses (for future expansion)
- Enrollments (student-course relationships)

## Security Features

- **Password Hashing:** All passwords are hashed using bcrypt
- **JWT Authentication:** Secure token-based authentication
- **Input Validation:** Server-side validation for all inputs
- **Rate Limiting:** Protection against brute force attacks
- **CORS Configuration:** Proper cross-origin resource sharing setup
- **Helmet.js:** Security headers for Express applications

## Development

### Project Structure
```
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Main application pages
│   │   ├── contexts/      # React contexts (Auth)
│   │   └── lib/           # Utilities and API client
├── server/                # Express backend
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   └── database/      # Database configuration
└── database/              # SQLite database files
```

### Available Scripts

**Root Level:**
- `npm run dev` - Start both client and server in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend client
- `npm run build` - Build the client for production
- `npm run install-all` - Install all dependencies

**Server:**
- `npm run dev` - Start server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server

**Client:**
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Customization

### Adding New Fields
1. Update the database schema in `server/src/database/schema.sql`
2. Update the TypeScript interfaces in the model files
3. Update the API controllers to handle new fields
4. Update the frontend forms and display components

### Styling
- Modify `client/src/index.css` for global styles
- Update Tailwind configuration in `client/tailwind.config.js`
- Customize component styles using Tailwind utility classes

### Database
- The system uses SQLite for simplicity and portability
- Database file is created automatically on first run
- Sample data is inserted during initialization

## Deployment

### Production Build
```bash
# Build the client
cd client
npm run build

# Build the server
cd ../server
npm run build

# Set environment variables
export NODE_ENV=production
export JWT_SECRET=your-secure-secret-key

# Start production server
npm start
```

### Environment Variables
Create a `.env` file in the server directory:
```
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
DB_PATH=../database/sfms.db
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Change the port in `server/.env` or `client/package.json`

2. **Database Connection Issues**
   - Ensure the database directory exists
   - Check file permissions

3. **Authentication Errors**
   - Verify JWT_SECRET is set correctly
   - Check token expiration

4. **Build Errors**
   - Clear node_modules and reinstall dependencies
   - Check Node.js version compatibility

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for educational or commercial purposes.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check the browser console for client-side errors
4. Check server logs for backend issues
