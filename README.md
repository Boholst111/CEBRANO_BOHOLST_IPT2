# 🎓 Student and Faculty Management System

A comprehensive, modern web-based management system for educational institutions to efficiently manage students and faculty members.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-16+-green.svg)
![React](https://img.shields.io/badge/react-18-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.3-blue.svg)

## ✨ Features

### 🎓 Student Management
- Complete CRUD operations for student records
- Advanced search and filtering capabilities
- Academic progress tracking (GPA, year level, program)
- Emergency contact management
- Enrollment status tracking

### 👨‍🏫 Faculty Management
- Comprehensive faculty member profiles
- Department and position management
- Salary and qualification tracking
- Office location and specialization details

### 📊 Dashboard & Analytics
- Real-time statistics and insights
- Visual charts for data distribution
- Quick action shortcuts
- Responsive data visualization

### 🔐 Security & Authentication
- JWT-based secure authentication
- Role-based access control
- Password encryption with bcrypt
- Rate limiting and security headers

### 🎨 Modern UI/UX
- Fully responsive design
- Clean, professional interface
- Accessibility-focused components
- Mobile-first approach

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **TailwindCSS** for styling
- **shadcn/ui** components
- **Lucide React** icons
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MySQL** with mysql2
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation

## 📦 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- **MySQL Server** (see [MYSQL_SETUP.md](./MYSQL_SETUP.md) for installation)

### Installation

**Option 1: Automated Setup**
```bash
# Windows
./install.bat

# macOS/Linux
chmod +x install.sh && ./install.sh
```

**Option 2: Manual Setup**
```bash
# 1. Set up MySQL (see MYSQL_SETUP.md)
# 2. Configure .env file in server/ directory
# 3. Install all dependencies
npm run install-all

# 4. Start development servers
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Default Login**: admin / admin123

## 📁 Project Structure

```
├── client/                 # React frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Main application pages
│   │   ├── contexts/      # React contexts
│   │   └── lib/           # Utilities and configurations
├── server/                # Express backend application
│   ├── src/
│   │   ├── controllers/   # API route handlers
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # MySQL database models
│   │   ├── routes/        # API routes
│   │   └── config/        # Database configuration
└── docs/                  # Documentation and setup guides
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create new student
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Faculty
- `GET /api/faculty` - Get all faculty members
- `POST /api/faculty` - Create new faculty member
- `GET /api/faculty/:id` - Get faculty by ID
- `PUT /api/faculty/:id` - Update faculty member
- `DELETE /api/faculty/:id` - Delete faculty member

## 🛠️ Development

### Available Scripts

**Root Level:**
- `npm run dev` - Start both client and server
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run build` - Build for production
- `npm run install-all` - Install all dependencies

### Environment Variables

Create `.env` file in server directory:
```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sfms_db
DB_USER=root
DB_PASSWORD=your_mysql_password
```

## 📖 Documentation

For detailed documentation, see [DOCUMENTATION.md](./DOCUMENTATION.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by educational management needs
- Designed for scalability and maintainability

## 📞 Support

If you encounter any issues or have questions:
1. Check the [DOCUMENTATION.md](./DOCUMENTATION.md)
2. Review existing issues on GitHub
3. Create a new issue with detailed information

---

**Made with ❤️ for educational institutions**
