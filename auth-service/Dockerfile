# Step 1: Use an official Node.js runtime as a parent image
FROM node:22-alpine

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code to the working directory
COPY . .

# Step 6: Expose the port that the app runs on
EXPOSE 8081

# Step 7: Start the application
CMD ["node", "index.js"]
