# https://docs.adonisjs.com/guides/getting-started/deployment
FROM node:20.12.2-alpine3.18 as base

##################################
#### First stage of the build ####
##################################
FROM base AS deps

# Set up PNPM
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Set where to perform the next actions
WORKDIR /app

# Copy over our backend/package.json and pnpm-lock.yaml files
COPY backend/package.json backend/pnpm-lock.yaml ./

# Install ALL dependencies (including dev)
# https://pnpm.io/docker
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --no-frozen-lockfile

###################################
#### Second stage of the build ####
###################################
FROM base AS buildstage

# Set where to perform the next actions
WORKDIR /app

# Copy code and deps from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Copy our backend code to the stage
COPY backend ./

# Build it
RUN node ace build

##################################
#### Final stage of the build ####
##################################
FROM base

# Set where to perform the next actions
WORKDIR /app

# Copy build and modules over to this stage
COPY --from=buildstage /app/build ./
COPY --from=deps /app/node_modules ./node_modules

LABEL org.opencontainers.image.source=https://github.com/Morfusee/MO-IT122-DevOps

EXPOSE 3333
CMD ["node", "./bin/server.js"]