FROM mcr.microsoft.com/devcontainers/base:dev-ubuntu-24.04

# Main dependency installation
# (Some of these might already exist in base image.)
RUN apt-get update && apt-get install -y \
    software-properties-common \
    make \
    gcc \
    build-essential \
    git \
    wget \
    libgif7 \
    libpixman-1-0 \
    libffi-dev \
    libreadline-dev \
    librsvg2-bin \
    zlib1g-dev \
    graphicsmagick \
    default-jre

# Dependencies specifically for Puppeteer on unix
# (Some of these might already exist in base image.)
RUN apt-get install -y \
    libasound2t64 \
    libatk1.0-0t64 \
    libatk-bridge2.0-0t64 \
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

# Add node source for new nodejs, instead of old Ubuntu-installed node.
# https://github.com/nodesource/distributions/wiki/How-to-migrate-to-the-new-repository

# 1. Install necessary packages for downloading and verifying new repository information
# 2. Create a directory for the new repository's keyring, if it doesn't exist
# 3. Download the new repository's GPG key and save it in the keyring directory
# 4. Add the new repository's source list with its GPG key for package verification
#    Note: `node_20` means Node version 20. Update in future as needed.
# 5. Update local package index to recognize the new repository
# 6. Install Node.js from the new repository
RUN apt-get install -y ca-certificates curl gnupg \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
    && apt-get update \
    && apt-get install -y nodejs

# Install pandoc for document conversion
RUN wget https://github.com/jgm/pandoc/releases/download/3.7.0.2/pandoc-3.7.0.2-1-amd64.deb \
    && dpkg -i pandoc-3.7.0.2-1-amd64.deb

# Install Gulp cli app
RUN npm install --global gulp-cli

# # Clear apt cache to make image smaller
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/*

# Install RVM and Ruby
RUN curl -sSL https://rvm.io/mpapis.asc | gpg --import - \
    && curl -sSL https://rvm.io/pkuczynski.asc | gpg --import - \
    && curl -sSL https://get.rvm.io | bash -s stable \
    && echo 'source /etc/profile.d/rvm.sh' >> /etc/bash.bashrc \
    && bash -lc "rvm install 3.3.5 && rvm use 3.3.5 --default && gem install bundler"

# Fix permissions for RVM and Gems
RUN mkdir -p /usr/local/rvm/gems \
    && chown -R vscode:vscode /usr/local/rvm \
    && chmod -R g+w /usr/local/rvm

# Set Ruby environment variables
ENV PATH /usr/local/rvm/bin:/usr/local/rvm/rubies/ruby-3.3.5/bin:$PATH
ENV GEM_HOME=/usr/local/rvm/gems/ruby-3.3.5
ENV GEM_PATH=/usr/local/rvm/gems/ruby-3.3.5:/usr/local/rvm/gems/ruby-3.3.5@global

# Install fonts for PrinceXML
# 1. Accept the EULA
# 2. Install packages
# 3. Refresh the font cache
RUN echo "ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true" | debconf-set-selections \
    && apt-get update && apt-get install -y --no-install-recommends fontconfig ttf-mscorefonts-installer \
    && fc-cache -f -v

# Add Prince to PATH.
# Prince will actually be installed here
# by a Node process in the container
ENV PATH="/workspaces/electric-book/node_modules/prince/prince/bin:${PATH}"
