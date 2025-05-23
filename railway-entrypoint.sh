#!/bin/bash

# Print environment info (without sensitive data)
echo "🔍 Environment: $NODE_ENV"

# Extract database host and port from connection string if available
if [[ "$DB_HOST" == postgres://* ]]; then
  # Extract hostname and port from connection string
  DB_HOST_NAME=$(echo $DB_HOST | sed -E 's/postgres:\/\/[^:]+:[^@]+@([^:]+):.*/\1/')
  DB_PORT=$(echo $DB_HOST | sed -E 's/postgres:\/\/[^:]+:[^@]+@[^:]+:([0-9]+)\/.*/\1/')
  echo "🔍 Database host: $DB_HOST_NAME (port: $DB_PORT) (from connection string)"
else
  echo "🔍 Database host: $DB_HOST (direct configuration)"
fi

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Start the application
echo "🚀 Starting application..."
node server.js