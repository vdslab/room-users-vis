# Use an official Node.js runtime as the base image
FROM node:lts-slim

# Set the working directory in the container to /app
WORKDIR /app

# Install openssl
RUN apt-get update -y && apt-get install -y openssl

# Copy package.json and pnpm-lock.yaml (if available) into the root directory of the app
COPY package.json pnpm-lock.yaml ./

# Copy the rest of your app's source code into the app directory
COPY . .

# Install pnpm globally in the container
RUN npm install -g pnpm

# Install project dependencies
RUN pnpm install

# Build the app
RUN pnpm run build

# Expose port 3000 for the app to be accessible
EXPOSE 3000

# Define the command to run your app using CMD which defines your runtime
CMD ["pnpm", "start"]