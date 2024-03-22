FROM ubuntu:20.04

# Set default locale for the environment
ENV LC_ALL C.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8

# Install dependencies required to set timezone 
RUN apt-get update && apt-get install -y \
  locales libcurl4 curl

# Set timezone
RUN ln -snf /usr/share/zoneinfo/$(curl https://ipapi.co/timezone) /etc/localtime

# Add node source for nodejs version 12, instead of Ubuntu installed node (version 10)
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash

# Main dependency installation and clear apt cache to make image smaller
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
  ruby \
  ruby-dev \
  graphicsmagick && \
  rm -rf /var/lib/apt/lists/*

# Install PrinceXML for printing to PDF
RUN wget https://www.princexml.com/download/prince_11.4-1_ubuntu18.04_amd64.deb && \
  dpkg -i prince_11.4-1_ubuntu18.04_amd64.deb

# Install pandoc for document conversion
RUN wget https://github.com/jgm/pandoc/releases/download/2.5/pandoc-2.5-1-amd64.deb && \
  dpkg -i pandoc-2.5-1-amd64.deb

# Pin RubyGems to 3.0.6 and install Jekyll
RUN gem update --system 3.0.6 --no-document && gem install bundler:1.16.1 jekyll

# Install Gulp cli app
RUN npm install --global gulp-cli

WORKDIR /app
COPY . /app

RUN bundle install

RUN npm install \
  && npm install gulp-cli

COPY ./_tools/docker/entrypoint.sh /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]
