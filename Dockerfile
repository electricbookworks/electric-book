FROM ubuntu:20.04

# Set default locale for the environment
ENV LC_ALL C.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8

RUN echo exit 0 > /usr/sbin/policy-rc.d

RUN apt-get update && apt-get install -y \
  locales libcurl4 curl

RUN ln -snf /usr/share/zoneinfo/$(curl https://ipapi.co/timezone) /etc/localtime

RUN apt-get install -y \
  software-properties-common \
  make \
  gcc \
  build-essential \
  git \
  wget \
  libgif7 \
  # chrpath \
  # libssl-dev \
  # libxft-dev \
  # libfreetype6-dev \
  # libfreetype6 \
  # libfontconfig1-dev \
  # libfontconfig1 \
  nodejs \
  npm \
  ruby \
  ruby-dev \
  graphicsmagick && \
  rm -rf /var/lib/apt/lists/*


RUN wget https://www.princexml.com/download/prince_14.2-1_ubuntu20.04_amd64.deb && \
  dpkg -i prince_14.2-1_ubuntu20.04_amd64.deb

RUN wget https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2 && \
  tar xvjf phantomjs-2.1.1-linux-x86_64.tar.bz2 -C /usr/local/share/ && \
  ln -s /usr/local/share/phantomjs-2.1.1-linux-x86_64/bin/phantomjs /usr/local/bin/

RUN wget https://github.com/jgm/pandoc/releases/download/2.5/pandoc-2.5-1-amd64.deb && \
  dpkg -i pandoc-2.5-1-amd64.deb

RUN gem update --system 3.0.6 --no-document && \
  gem install jekyll bundler

RUN npm install --global gulp-cli

WORKDIR /app
COPY . /app

RUN bundle update && \
  bundle install && \
  npm install

# CMD run-linux.sh
