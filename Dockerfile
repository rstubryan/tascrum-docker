# Frontend build stage
FROM oven/bun:1 AS frontend-base
WORKDIR /tafe-scrum

# Install frontend dependencies
FROM frontend-base AS frontend-deps
COPY tafe-scrum/package.json .
COPY tafe-scrum/bun.lock ./bun.lock
RUN bun install --frozen-lockfile

# Frontend build
FROM frontend-deps AS frontend-build
COPY tafe-scrum/ .
# Copy environment variables for build
# COPY .env.prod .env
RUN bun --bun run build

# Frontend production
FROM frontend-base AS frontend-release
ENV NODE_ENV=production

# Copy necessary files for production
COPY --from=frontend-deps /tafe-scrum/node_modules ./node_modules
COPY --from=frontend-build /tafe-scrum/.next ./.next
COPY --from=frontend-build /tafe-scrum/public ./public
COPY --from=frontend-build /tafe-scrum/package.json ./package.json
# Copy environment variables for runtime
# COPY .env.prod .env

# Run as non-root user for better security
USER bun

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["bun", "start"]

# Backend stage
FROM python:3.11-slim AS backend
LABEL maintainer="support@taiga.io"

# Avoid prompting for configuration
ENV DEBIAN_FRONTEND=noninteractive

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONFAULTHANDLER=1

# Use a virtualenv
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Get the code
COPY taiga-back/ /taiga-back
WORKDIR /taiga-back

# grab gosu for easy step-down from root
# https://github.com/tianon/gosu/blob/master/INSTALL.md
ENV GOSU_VERSION 1.12

RUN set -eux; \
   apt-get update; \
   # install system dependencies
   apt-get install -y \
      build-essential \
      gettext \
      # libpq5 needed in runtime for psycopg2
      libpq5 \
      libpq-dev \
      git \
      net-tools \
      procps \
      wget; \
   # install gosu
   apt-get install -y --no-install-recommends ca-certificates wget; \
   dpkgArch="$(dpkg --print-architecture | awk -F- '{ print $NF }')"; \
   wget -O /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$dpkgArch"; \
wget -O /usr/local/bin/gosu.asc "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$dpkgArch.asc"; \
   chmod +x /usr/local/bin/gosu; \
   # verify gosu signature
   export GNUPGHOME="$(mktemp -d)"; \
gpg --batch --keyserver hkps://keys.openpgp.org --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4; \
gpg --batch --verify /usr/local/bin/gosu.asc /usr/local/bin/gosu; \
command -v gpgconf && gpgconf --kill all || :; \
rm -rf "$GNUPGHOME" /usr/local/bin/gosu.asc; \
   # install Taiga dependencies
   python -m pip install --upgrade pip; \
   python -m pip install wheel; \
   python -m pip install -r requirements.txt; \
   python -m pip install -r requirements-contribs.txt; \
   python manage.py compilemessages; \
   python manage.py collectstatic --no-input; \
   chmod +x docker/entrypoint.sh; \
   chmod +x docker/async_entrypoint.sh; \
   cp docker/config.py settings/config.py; \
   #  create taiga group and user to use it and give permissions over the code (in entrypoint)
   groupadd --system taiga --gid=999; \
   useradd --system --no-create-home --gid taiga --uid=999 --shell=/bin/bash taiga; \
   mkdir -p /taiga-back/media/exports; \
   chown -R taiga:taiga /taiga-back; \
   # remove unneeded files and packages
   apt-get purge -y \
      build-essential \
      gettext \
      git \
      libpq-dev \
      net-tools \
      procps \
      wget; \
   apt-get autoremove -y; \
   rm -rf /var/lib/apt/lists/*; \
   rm -rf /root/.cache; \
   # clean taiga
   rm requirements.txt; \
   rm requirements-contribs.txt; \
   find . -name '__pycache__' -exec rm -r '{}' +; \
   find . -name '*pyc' -exec rm -r '{}' +; \
   find . -name '*po' -exec rm -r '{}' +

ENV DJANGO_SETTINGS_MODULE=settings.config

EXPOSE 8000
ENTRYPOINT ["./docker/entrypoint.sh"]