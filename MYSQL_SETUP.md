# MySQL Setup Guide

Your Student & Faculty Management System has been converted to use MySQL instead of SQLite. Follow these steps to set up MySQL:

## 📋 Prerequisites

1. **Install MySQL Server**
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or install via package manager:
     ```bash
     # Windows (using Chocolatey)
     choco install mysql
     
     # macOS (using Homebrew)
     brew install mysql
     
     # Ubuntu/Debian
     sudo apt install mysql-server
     ```

2. **Start MySQL Service**
   ```bash
   # Windows
   net start mysql
   
   # macOS
   brew services start mysql
   
   # Linux
   sudo systemctl start mysql
   ```

## 🔧 Configuration

1. **Create Database User (Optional)**
   ```sql
   -- Connect to MySQL as root
   mysql -u root -p
   
   -- Create a new user for the application
   CREATE USER 'sfms_user'@'localhost' IDENTIFIED BY 'your_secure_password';
   
   -- Grant privileges
   GRANT ALL PRIVILEGES ON sfms_db.* TO 'sfms_user'@'localhost';
   FLUSH PRIVILEGES;
   
   -- Exit MySQL
   EXIT;
   ```

2. **Configure Environment Variables**
   
   Create a `.env` file in the `server/` directory:
   ```env
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   
   # MySQL Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=sfms_db
   DB_USER=root
   DB_PASSWORD=your_mysql_root_password
   ```

   **Or if you created a specific user:**
   ```env
   DB_USER=sfms_user
   DB_PASSWORD=your_secure_password
   ```

## 🚀 Running the Application

1. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Start the Server**
   ```bash
   npm run dev
   ```

   The application will:
   - ✅ Connect to MySQL
   - ✅ Create the database `sfms_db` if it doesn't exist
   - ✅ Create all necessary tables
   - ✅ Insert sample data and admin user

## 🔐 Default Login Credentials

- **Username**: `admin`
- **Password**: `admin123`

## 📊 Database Tables Created

The application will automatically create these tables:

1. **users** - Admin authentication
2. **students** - Student records
3. **faculty** - Faculty member records
4. **courses** - Course information
5. **enrollments** - Student-course relationships

## 🔍 Troubleshooting

### Connection Issues
- Ensure MySQL service is running
- Check username/password in `.env` file
- Verify MySQL is listening on port 3306

### Permission Issues
```sql
-- Grant additional privileges if needed
GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT ON sfms_db.* TO 'your_user'@'localhost';
FLUSH PRIVILEGES;
```

### Reset Database
```sql
-- Connect to MySQL
mysql -u root -p

-- Drop and recreate database
DROP DATABASE IF EXISTS sfms_db;
CREATE DATABASE sfms_db;
```

## 🔄 Migration from SQLite

Your data has been migrated from SQLite to MySQL with the following improvements:

- **Better Performance**: MySQL handles concurrent connections better
- **Scalability**: Can handle larger datasets
- **Production Ready**: Suitable for deployment
- **Advanced Features**: Supports transactions, foreign keys, and more

## 📝 Notes

- The database will be created automatically on first run
- Sample data is inserted only if tables are empty
- All passwords are properly hashed with bcrypt
- The application uses connection pooling for better performance
