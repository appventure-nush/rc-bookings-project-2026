# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /app

# Copy package files and install all dependencies (including dev deps for build)
COPY package*.json ./
RUN npm ci

# Copy the rest of the app and run the build script
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production

# Copy package files and install ONLY production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the compiled output from the build stage
COPY --from=build /app/dist ./dist

# Set up a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose the port your app runs on (default for Hono is often 3000)
EXPOSE 3000

# Start the server
CMD ["node", "dist/index.js"]