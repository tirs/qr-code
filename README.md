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

1. **Railway Account**: Create an account at [Railway.app](https://railway.app/)
2. **Railway CLI**: Install the Railway CLI tool
   ```
   npm install -g @railway/cli
   ```
3. **Login to Railway CLI**
   ```
   railway login
   ```

### Automated Deployment

Run the deployment script:

```bash
node deploy.js
```

Follow the prompts to enter your Railway project name and confirm deployment.

### Manual Deployment

1. **Create a New Project on Railway**
   - Go to [Railway Dashboard](https://railway.app/dashboard)
   - Click "New Project"
   - Select "Deploy from GitHub repo" or "Empty Project"
   - Add a PostgreSQL database from the Railway dashboard

2. **Configure Environment Variables**
   Set the following environment variables in your Railway project:
   - `PORT`: 3000 (or your preferred port)
   - `DB_HOST`: Your PostgreSQL connection string (provided by Railway)
   - `SESSION_SECRET`: A secure random string for session encryption
   - `ADMIN_USERNAME`: Admin username for the dashboard
   - `ADMIN_PASSWORD`: Admin password for the dashboard
   - `NODE_ENV`: production

3. **Link to Your Railway Project**
   ```
   railway link --environment production --project YOUR_PROJECT_NAME
   ```

4. **Deploy the Application**
   ```
   railway up
   ```

5. **Check Deployment Status**
   ```
   railway status
   ```

6. **Open the Deployed Application**
   ```
   railway open
   ```

7. **Reset admin password if needed**
   If you need to reset the admin password after deployment, you can run:
   ```bash
   railway run node create-admin.js
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