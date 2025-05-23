# QR Code Verification System

A secure and reliable product verification system to protect your brand and customersecure and reliable product verification system to protect your brand and customers.

## Features

- **Product Verification**: Users scan QR codes and enter the last 4 characters of a 16-character verification code to verify product authenticity
- **Admin Dashboard**: Manage products, verification codes, and view verification logs
- **QR Code Generation**: Generate and download QR codes for products
- **Verification Code Management**: Create and manage 16-character verification codes
- **Analytics**: Track verification attempts and success rates
- **Dark/Light Theme**: Toggle between dark and light themes for better user experience
- **Responsive Design**: Mobile-friendly interface that works on all devices
- **Secure Authentication**: Session-based authentication with bcrypt for password hashing

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Frontend**: EJS templates with Bootstrap 5
- **Authentication**: Session-based authentication with bcrypt for password hashing
- **QR Code Generation**: QRCode.js library
- **CSS**: Custom CSS with CSS variables for theming

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a PostgreSQL database
4. Configure environment variables in `.env` file (see `.env.example` for reference):
   ```
   PORT=3000
   DB_HOST=postgres://username:password@hostname:port/database?sslmode=require
   SESSION_SECRET=your_session_secret
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your_admin_password
   NODE_ENV=development
   ```
5. Run the application:
   ```
   npm start
   ```
6. Access the application at `http://localhost:3000`

## Deployment to Railway

### Prerequisites

1. [Railway account](https://railway.app/)
2. [Railway CLI](https://docs.railway.app/develop/cli) (optional)
3. PostgreSQL database (can be provisioned on Railway)

### Steps to Deploy

1. **Create a new project on Railway**

   ```bash
   railway init
   ```

2. **Add a PostgreSQL database**

   From the Railway dashboard, add a PostgreSQL database to your project.

3. **Set environment variables**

   Set the following environment variables in the Railway dashboard:

   - `DB_HOST`: Your PostgreSQL connection string (provided by Railway)
   - `SESSION_SECRET`: A strong random string
   - `ADMIN_USERNAME`: Admin username
   - `ADMIN_PASSWORD`: Admin password
   - `NODE_ENV`: production

4. **Deploy your application**

   Connect your GitHub repository or deploy directly using the Railway CLI:

   ```bash
   railway up
   ```

5. **Reset admin password if needed**

   If you need to reset the admin password after deployment, you can run:

   ```bash
   railway run node reset-admin.js
   ```

### Automatic Deployments

Railway supports automatic deployments from GitHub. Connect your repository in the Railway dashboard for continuous deployment.

## Usage

### Admin Access

1. Navigate to `/auth/login`
2. Login with admin credentials (default: admin/admin123)
3. Use the dashboard to manage products and verification codes

### Product Verification

1. Scan a QR code on a product
2. Enter the last 4 characters of the 16-character verification code printed on the product
3. View verification result

### Theme Switching

Use the theme toggle switch in the navigation bar to switch between light and dark themes.

## Troubleshooting

If you encounter login issues, you can reset the admin password by running:

```bash
node reset-admin.js
```

## License

ISC