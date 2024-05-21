FROM node:18-slim

WORKDIR /usr/src/app

# Copy the SQLite database file into the container
COPY ./data.db /usr/src/app/data.db


# Change permissions of the database file to make it accessible
RUN chmod 644 /usr/src/app/data.db

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 8055
EXPOSE 8055

# Start the application
CMD ["npx", "directus", "start"]
