# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the .env file
COPY .env .env

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 80

# Start the Next.js application on port 80
CMD ["npm", "run", "start", "--", "-p", "80"]