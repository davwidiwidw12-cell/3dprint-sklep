# Use official Node.js 18 (LTS) image as base
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies necessary for node-gyp (if needed by any package)
# libc6-compat might be needed for some binaries
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
# Disable type checking during build to save time/memory in CI/CD, assuming local check passed
# ENV NEXT_IGNORE_TYPE_CHECKS=true 
# We run build with webpack enabled explicitly as per project config
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Create a group and user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# We need to copy .next/standalone to run the app in standalone mode
# Note: Next.js standalone mode is required for efficient Docker images
# You must enable "output: 'standalone'" in next.config.mjs if not already set.
# If not using standalone, we would copy .next and node_modules.

# Check if standalone exists, if not, fallback to standard start (less efficient)
# For this setup, let's assume standard start for simplicity unless we config standalone.
# Standard start:
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Setup directory for uploads (needs persistence in production!)
RUN mkdir -p public/uploads && chown nextjs:nodejs public/uploads

# Switch to non-root user
USER nextjs

EXPOSE 3000

ENV PORT 3000

# Start command
# We use a custom start script or just next start
CMD ["npm", "start"]
