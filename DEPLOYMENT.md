# QR Code Verification System Deployment Guide

This guide explains how to deploy the QR Code Verification System to Railway.

## Prerequisites

1. **Railway CLI**: Install the Railway CLI tool
   ```
   npm install -g @railway/cli
   ```

2. **Railway Account**: Create an account at [Railway.app](https://railway.app/)

3. **Login to Railway CLI**
   ```
   railway login
   ```

## Deployment Steps

### 1. Create a New Project on Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo" or "Empty Project"
4. Note down your project name

### 2. Configure Environment Variables

Set the following environment variables in your Railway project:

- `PORT`: 3000 (or your preferred port)
- `DB_HOST`: Your PostgreSQL connection string
- `SESSION_SECRET`: A secure random string for session encryption
- `ADMIN_USERNAME`: Admin username for the dashboard
- `ADMIN_PASSWORD`: Admin password for the dashboard
- `NODE_ENV`: production

### 3. Deploy Using the Script

Run the deployment script:

```
node deploy.js
```

Follow the prompts to enter your Railway project name and confirm deployment.

### 4. Manual Deployment (Alternative)

If you prefer to deploy manually:

1. Link to your Railway project
   ```
   railway link --environment production --project YOUR_PROJECT_NAME
   ```

2. Deploy the application
   ```
   railway up
   ```

3. Check deployment status
   ```
   railway status
   ```

4. Open the deployed application
   ```
   railway open
   ```

## Monitoring and Troubleshooting

### Health Checks

The application provides health check endpoints:

- `/health`: Basic health check (always returns 200 OK)
- `/health/detailed`: Detailed health check including database status

### Logs

Logs are stored in the `logs` directory:

- `access.log`: General application logs
- `error.log`: Error logs
- `health-check.log`: Health check server logs

To view logs on Railway:
```
railway logs
```

## QR Code Generation

After deployment, you can generate QR codes for your products through the admin dashboard:

1. Access the admin dashboard at `/admin/login`
2. Log in with your admin credentials
3. Navigate to "Products" and create new products
4. Generate QR codes for each product

## Testing the Deployment

1. Open your deployed application URL
2. Scan a QR code from the admin dashboard
3. Enter the last 4 characters of the verification code
4. Verify that the product authentication works correctly

## Troubleshooting

If you encounter issues during deployment:

1. Check the Railway logs: `railway logs`
2. Verify your environment variables are set correctly
3. Ensure your database is accessible from Railway
4. Check the application logs in the `logs` directory

For database connection issues, verify:
- The database connection string is correct
- The database is accessible from Railway's IP range
- SSL settings are properly configured

## Support

If you need further assistance, please contact the development team.