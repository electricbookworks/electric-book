# This Dockerfile defines a virtual machine for gitpod.io
# so that you can  use this Electric Book template project
# in your browser (i.e. an online development environment).
# See https://www.gitpod.io/docs/config-docker

FROM gitpod/workspace-ruby-2

# Main dependency installation
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
  zlib1g-dev \
  nodejs \
  graphicsmagick

# Dependencies specifically for Puppeteer on unix
RUN apt-get install -y \
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

# # Clear apt cache to make image smaller
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/*

# Add node source for new nodejs, instead of old Ubuntu-installed node
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash

# Install PrinceXML for printing to PDF
RUN wget https://www.princexml.com/download/prince_11.4-1_ubuntu18.04_amd64.deb && \
  dpkg -i prince_11.4-1_ubuntu18.04_amd64.deb

# Install pandoc for document conversion
RUN wget https://github.com/jgm/pandoc/releases/download/2.5/pandoc-2.5-1-amd64.deb && \
  dpkg -i pandoc-2.5-1-amd64.deb

# Update npm
RUN npm install -g npm@latest

# Install Gulp cli app
RUN npm install --global gulp-cli

# Pin RubyGems to 3.0.8
# (https://github.com/rubygems/rubygems/issues/3068)
RUN gem update --system 3.0.8 --no-document

# Install latest EBT-compatible Jekyll
RUN gem install bundler:latest jekyll:3.9.2
