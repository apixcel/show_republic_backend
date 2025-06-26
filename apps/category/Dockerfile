
# Use Node.js base image
FROM node:20

# Set the working directory
WORKDIR /var/www

# Increase max-old-space-size to improve memory handling
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Copy only package.json and package-lock.json to leverage Docker caching
COPY package*.json ./

# Install root-level dependencies
RUN npm install

# Copy the entire workspace into the container
COPY . .

# Expose the application port
EXPOSE 3000

# Start the application using nodemon with npx
CMD ["sh", "-c", "sleep 3 && npx nodemon --config apps/category/nodemon.json"]

