# This Dockerfile defines a virtual machine for gitpod.io
# so that you can  use this Electric Book template project
# in your browser (i.e. an online development environment).
# See https://www.gitpod.io/docs/config-docker

FROM ubuntu:20.04

# Set environment and user
ENV HOME=/home/gitpod
WORKDIR $HOME

# Create the gitpod user. UID must be 33333.
RUN useradd -l -u 33333 -G sudo -md /home/gitpod -s /bin/bash -p gitpod gitpod
USER gitpod

# Set default locale for the environment
ENV LC_ALL C.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8

# Install dependencies required to set timezone
RUN apt-get update && apt-get install -y \
  locales libcurl4 curl

# Set timezone
RUN ln -snf /usr/share/zoneinfo/$(curl https://ipapi.co/timezone) /etc/localtime

# Add node source for new nodejs, instead of old Ubuntu-installed node
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash

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

# Clear apt cache to make image smaller
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/*

# Install Ruby with rvm for better gem control
# Thanks https://github.com/carpentries-incubator/jekyll-pages-novice/blob/gh-pages/.gitpod.Dockerfile
RUN rm -f ~/.rvmrc ~/.bashrc.d/70-ruby \
    && bash -lc " \
        rvm requirements \
        && rvm install 2.7.2 \
        && rvm use 2.7.2 --default \
        && rvm rubygems current \
        && gem install bundler --no-document" \
    && echo '[[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm" # Load RVM into a shell session *as a function*' >> /home/gitpod/.bashrc.d/70-ruby \
    && echo "rvm_gems_path=/workspace/.rvm" > ~/.rvmrc

# Pin RubyGems to 3.0.8
# (https://github.com/rubygems/rubygems/issues/3068)
RUN gem update --system 3.0.8 --no-document

# Install PrinceXML for printing to PDF
RUN wget https://www.princexml.com/download/prince_11.4-1_ubuntu18.04_amd64.deb && \
  dpkg -i prince_11.4-1_ubuntu18.04_amd64.deb

# Install pandoc for document conversion
RUN wget https://github.com/jgm/pandoc/releases/download/2.5/pandoc-2.5-1-amd64.deb && \
  dpkg -i pandoc-2.5-1-amd64.deb

# Install latest EBT-compatible Jekyll
RUN gem install jekyll:3.9.2

# Update npm
RUN npm install -g npm@latest

# Install Gulp cli app
RUN npm install --global gulp-cli
