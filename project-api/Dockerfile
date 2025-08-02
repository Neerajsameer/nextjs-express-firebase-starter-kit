# set base image public.ecr.aws/docker/library/
FROM node:18

# set the working directory in the container
WORKDIR /usr/src/app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Generate Prisma client and build the application
RUN npx prisma generate \
    && pnpm build \
    && pnpm prune --prod

ENV NODE_ENV=production

EXPOSE 8080

# command to run on container start
CMD [ "pnpm", "start" ]
