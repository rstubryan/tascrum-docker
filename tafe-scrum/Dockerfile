# Use the official Bun image
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Install dependencies stage
FROM base AS deps
COPY package.json .
COPY bun.lock ./bun.lock
RUN bun install --frozen-lockfile

# Build stage
FROM deps AS build
COPY . .
# Copy environment variables for build
# COPY .env .env
RUN bun --bun run build

# Production stage
FROM base AS release
ENV NODE_ENV=production

# Copy necessary files for production
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/.next ./.next
COPY --from=build /usr/src/app/public ./public
COPY --from=build /usr/src/app/package.json ./package.json
# Copy environment variables for runtime
# COPY .env .env

# Run as non-root user for better security
USER bun

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["bun", "start"]