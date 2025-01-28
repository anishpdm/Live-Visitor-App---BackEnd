# Visitor Entry App

## Description
This is a REST API for a visitor entry application with Admin and Security roles. It uses Node.js, Express, Mongoose, bcrypt for password encryption, and jsonwebtoken for authentication.

## Features
### Admin Features:
- Login
- Add Security Guards
- Search Security Guards
- View All Security
- Remove Security
- View Daily Logs
- Search Daily Logs
- Change Password
- Logout
- Visitor Statistics

### Security Features:
- Login
- Add Daily Log
- View Daily Logs
- Edit Daily Logs
- Logout

## Installation
1. Clone the repository.
2. Navigate to the project directory and install dependencies:
   ```bash
   npm install
   ```
3. Add your MongoDB URI and JWT secret in the `.env` file.

## Usage
- Start the server:
  ```bash
  npm start
  ```

## API Documentation
**Admin Routes:**
- `POST /api/admin/login` - Login as Admin
- `POST /api/admin/add-security` - Add Security Guard
- `GET /api/admin/view-security` - View All Security Guards
- `DELETE /api/admin/remove-security/:id` - Remove Security Guard
- `GET /api/admin/view-logs` - View All Logs

**Security Routes:**
- `POST /api/security/login` - Login as Security
- `POST /api/security/add-log` - Add Daily Log
- `GET /api/security/view-logs` - View Your Logs
- `PUT /api/security/edit-log/:id` - Edit Your Log
