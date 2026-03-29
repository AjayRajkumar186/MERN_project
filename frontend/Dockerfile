# Use a newer Node.js version (22 is recommended for modern Vite/Tailwind)
FROM node:22-alpine

WORKDIR /app

# Clean start: copy package files
COPY package*.json ./

# Install dependencies (this will now run on Node 22)
RUN npm install

# Copy the rest of the code
COPY . .

EXPOSE 5173

# Add --host to allow external access
CMD ["npm", "run", "dev", "--", "--host"]