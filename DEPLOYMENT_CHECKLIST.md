# Deployment Checklist for QR Code Verification System

Use this checklist to ensure a successful deployment to Railway.

## Pre-Deployment Checks

- [ ] All form action URLs are correct (should start with `/admin/` where appropriate)
- [ ] Environment variables are properly configured in `.env.example`
- [ ] Database connection is properly configured in `src/config/config.js`
- [ ] All dependencies are listed in `package.json`
- [ ] `railway.json` file is present and correctly configured
- [ ] `.gitignore` file includes `.env` and other sensitive files
- [ ] `Procfile` is present with correct start command

## Railway Setup

- [ ] Railway account is created
- [ ] Railway CLI is installed (`npm install -g @railway/cli`)
- [ ] Logged in to Railway CLI (`railway login`)
- [ ] New project created on Railway
- [ ] PostgreSQL database provisioned on Railway

## Environment Variables

- [ ] `PORT` set to 3000 (or your preferred port)
- [ ] `DB_HOST` set to your PostgreSQL connection string
- [ ] `SESSION_SECRET` set to a secure random string
- [ ] `ADMIN_USERNAME` set to your admin username
- [ ] `ADMIN_PASSWORD` set to your admin password
- [ ] `NODE_ENV` set to `production`

## Deployment Steps

- [ ] Link to Railway project (`railway link --project YOUR_PROJECT_NAME`)
- [ ] Deploy application (`railway up` or `node deploy.js`)
- [ ] Check deployment status (`railway status`)
- [ ] Open deployed application (`railway open`)

## Post-Deployment Checks

- [ ] Application loads without errors
- [ ] Admin login works
- [ ] Products can be created
- [ ] QR codes can be generated
- [ ] Verification codes can be added
- [ ] Product verification works
- [ ] Database connection is stable

## Troubleshooting

If you encounter issues:

1. Check Railway logs: `railway logs`
2. Verify environment variables are set correctly
3. Ensure database is accessible
4. Check for any errors in the application logs
5. Try redeploying: `railway up`
6. If database issues persist, try recreating the admin user: `railway run node create-admin.js`