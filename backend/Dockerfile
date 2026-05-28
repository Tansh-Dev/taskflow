# Use official Node.js lightweight image
FROM node:18-alpine

# SQLite native module needs build tools
RUN apk add --no-cache python3 make g++

# Set working directory inside container
WORKDIR /app

# Copy package files first (for Docker layer caching)
COPY package*.json ./

# Install dependencies (including better-sqlite3 which needs compilation)
RUN npm install --production

# Copy rest of source code
COPY . .

# Create the data directory where SQLite file will live
RUN mkdir -p /app/data

# Expose the port our app runs on
EXPOSE 3001

# Start the application
CMD ["node", "server.js"]