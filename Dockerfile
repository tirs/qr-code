FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install app dependencies and add necessary tools
COPY package*.json ./
RUN npm install --ignore-scripts && \
    apk add --no-cache bash curl ca-certificates postgresql-client && \
    update-ca-certificates

# Bundle app source
COPY . .

# Make entrypoint script executable
RUN chmod +x /app/railway-entrypoint.sh

# Expose port
EXPOSE 3000

# Start the application with the entrypoint script
CMD ["/bin/bash", "/app/railway-entrypoint.sh"]