# Use a Node base image
FROM node:20

# Create and use app directory
WORKDIR /app

# Copy dependency files first
COPY package*.json ./
RUN npm install

# Copy rest of the backend code
COPY . .

# Expose the backend port (5000 in your case)
EXPOSE 5000

# Start the backend
CMD ["node", "app.js"]
