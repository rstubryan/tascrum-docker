# Use the official Bun image
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Install dependencies stage
FROM base AS deps
# Copy package manager files if they exist
COPY package.json* ./
COPY bun.lock* yarn.lock* package-lock.json* pnpm-lock.yaml* ./
# Install dependencies (using more flexible approach)
RUN if [ -f bun.lock ]; then \
      bun install --frozen-lockfile; \
    elif [ -f yarn.lock ]; then \
      yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then \
      npm ci; \
    elif [ -f pnpm-lock.yaml ]; then \
      npm install -g pnpm && pnpm install --frozen-lockfile; \
    else \
      bun install; \
    fi

# Build stage
FROM deps AS build
COPY . .
# Build with environment variables from ARGs
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_BASE_URL_BLOG
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
ENV NEXT_PUBLIC_BASE_URL_BLOG=${NEXT_PUBLIC_BASE_URL_BLOG}
RUN bun run build

# Production stage
FROM base AS release
ENV NODE_ENV=production

# Copy necessary files for production
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/.next ./.next
COPY --from=build /usr/src/app/public ./public || true
COPY --from=build /usr/src/app/package.json ./package.json

# Set runtime environment variables
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_BASE_URL_BLOG
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
ENV NEXT_PUBLIC_BASE_URL_BLOG=${NEXT_PUBLIC_BASE_URL_BLOG}

# Run as non-root user for better security
USER bun

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["bun", "start"]