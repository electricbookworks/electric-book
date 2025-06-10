FROM mcr.microsoft.com/devcontainers/ruby:3.3.5-bullseye

# Add Node.js source
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

# Install dependencies
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    nodejs \
    graphicsmagick \
    pandoc \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcairo2 \
    libdrm2 \
    libgbm1 \
    libnss3 \
    libpango-1.0-0 \
    libxkbcommon-x11-0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2

# Install PrinceXML
RUN wget https://www.princexml.com/download/prince_11.4-1_ubuntu18.04_amd64.deb \
    && dpkg -i prince_11.4-1_ubuntu18.04_amd64.deb \
    && rm prince_11.4-1_ubuntu18.04_amd64.deb

# Install global npm packages
RUN npm install -g gulp-cli

# Clean up
RUN apt-get clean -y && rm -rf /var/lib/apt/lists/*
