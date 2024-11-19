# This Dockerfile defines a virtual machine for gitpod.io
# so that you can  use this Electric Book template project
# in your browser (i.e. an online development environment).
# See https://www.gitpod.io/docs/config-docker

# You can find new timestamped tags at:
# https://hub.docker.com/r/gitpod/workspace-full/tags
FROM gitpod/workspace-full:2024-08-08-14-54-59

# Need to be root to apt install, even though
# GitPod docs say they discourage this.
# We'll switch to the gitpod user below.
USER root

# Main dependency installation
# (Some of these might already exist in workspace-full.)
RUN sudo apt-get update && apt-get install -y \
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
  zlib1g-dev \
  graphicsmagick

# Dependencies specifically for Puppeteer on unix
# (Some of these might already exist in workspace-full.)
RUN sudo apt-get install -y \
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

# Dependencies for Prince 11.4
RUN wget http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.0g-2ubuntu4_amd64.deb
RUN sudo dpkg -i libssl1.1_1.1.0g-2ubuntu4_amd64.deb

# # Clear apt cache to make image smaller
RUN sudo apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/*

# Add node source for new nodejs, instead of old Ubuntu-installed node.
# https://github.com/nodesource/distributions/wiki/How-to-migrate-to-the-new-repository

# Update local package index
RUN sudo apt-get update
# Install necessary packages for downloading and verifying new repository information
RUN sudo apt-get install -y ca-certificates curl gnupg
# Create a directory for the new repository's keyring, if it doesn't exist
RUN sudo mkdir -p /etc/apt/keyrings
# Download the new repository's GPG key and save it in the keyring directory
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
# Add the new repository's source list with its GPG key for package verification
# Note: `node_20` means Node version 20. Update in future as needed.
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
# Update local package index to recognize the new repository
RUN sudo apt-get update
# Install Node.js from the new repository
RUN sudo apt-get install -y nodejs

# Install PrinceXML for printing to PDF.
# This is a default version for older Electric Book template
# projects. Newer projects will use Prince in a Node module.
RUN wget https://www.princexml.com/download/prince_11.4-1_ubuntu18.04_amd64.deb && \
  dpkg -i prince_11.4-1_ubuntu18.04_amd64.deb

# Install pandoc for document conversion
RUN wget https://github.com/jgm/pandoc/releases/download/3.5/pandoc-3.5-1-amd64.deb && \
  dpkg -i pandoc-3.5-1-amd64.deb

# Update npm
RUN npm install -g npm@latest

# Install Gulp cli app
RUN npm install --global gulp-cli

# Switch to the gitpod user
USER gitpod

# Let gitpod own the NPM cache dir
RUN sudo chown -R 33333:33333 "$HOME/.npm"
