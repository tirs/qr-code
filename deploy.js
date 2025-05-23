const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Helper function to execute commands
function runCommand(command, errorMessage) {
  try {
    console.log(`${colors.cyan}> ${command}${colors.reset}`);
    return execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`${colors.red}${errorMessage || 'Command failed'}${colors.reset}`);
    console.error(error.message);
    process.exit(1);
  }
}

// Main deployment function
async function deploy() {
  console.log(`\n${colors.bright}${colors.green}=== QR Code Verification System Deployment ====${colors.reset}\n`);
  
  // Check if Railway CLI is installed
  try {
    execSync('railway --version', { stdio: 'ignore' });
  } catch (error) {
    console.log(`${colors.yellow}Railway CLI not found. Installing...${colors.reset}`);
    runCommand('npm install -g @railway/cli', 'Failed to install Railway CLI');
  }
  
  // Check if user is logged in to Railway
  try {
    execSync('railway whoami', { stdio: 'ignore' });
  } catch (error) {
    console.log(`${colors.yellow}You need to log in to Railway first.${colors.reset}`);
    runCommand('railway login', 'Failed to log in to Railway');
  }
  
  // Ask for project name
  const projectName = await new Promise((resolve) => {
    rl.question(`${colors.cyan}Enter your Railway project name: ${colors.reset}`, (answer) => {
      resolve(answer.trim());
    });
  });
  
  if (!projectName) {
    console.error(`${colors.red}Project name cannot be empty${colors.reset}`);
    process.exit(1);
  }
  
  // Link to Railway project
  console.log(`\n${colors.green}Linking to Railway project: ${projectName}${colors.reset}`);
  runCommand(`railway link --environment production --project ${projectName}`, 
    'Failed to link to Railway project. Make sure the project exists and you have access to it.');
  
  // Check if .env file exists and warn about sensitive data
  if (fs.existsSync('.env')) {
    console.log(`\n${colors.yellow}WARNING: .env file detected${colors.reset}`);
    console.log('Make sure your .env file is in .gitignore to prevent sensitive data from being uploaded.');
    
    const proceed = await new Promise((resolve) => {
      rl.question(`${colors.yellow}Continue with deployment? (y/n): ${colors.reset}`, (answer) => {
        resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
      });
    });
    
    if (!proceed) {
      console.log(`${colors.yellow}Deployment cancelled.${colors.reset}`);
      process.exit(0);
    }
  }
  
  // Deploy to Railway
  console.log(`\n${colors.green}Deploying to Railway...${colors.reset}`);
  runCommand('railway up', 'Deployment failed');
  
  // Show deployment status
  console.log(`\n${colors.green}Checking deployment status...${colors.reset}`);
  runCommand('railway status', 'Failed to get deployment status');
  
  // Open the deployed application
  const openApp = await new Promise((resolve) => {
    rl.question(`\n${colors.cyan}Open the deployed application? (y/n): ${colors.reset}`, (answer) => {
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
  
  if (openApp) {
    runCommand('railway open', 'Failed to open the application');
  }
  
  console.log(`\n${colors.bright}${colors.green}Deployment completed successfully!${colors.reset}`);
  console.log(`\n${colors.cyan}Next steps:${colors.reset}`);
  console.log(`1. Access your admin dashboard at: https://<your-railway-url>/admin/login`);
  console.log(`2. Log in with your admin credentials`);
  console.log(`3. Start creating products and generating QR codes`);
  
  rl.close();
}

// Run the deployment
deploy().catch((error) => {
  console.error(`${colors.red}Deployment failed:${colors.reset}`, error);
  process.exit(1);
});