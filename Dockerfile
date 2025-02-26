# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port (match the Express backend port)
EXPOSE 3000

# Start the backend server
CMD ["npm", "run", "dev"]
