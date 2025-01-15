# Stage 1: Install R packages and build the environment
FROM rocker/r-ver:4.3 AS builder

# Install system dependencies for R and plumber
RUN apt-get update -qq && apt-get install -y --no-install-recommends \
  git-core \
  libssl-dev \
  libcurl4-gnutls-dev \
  curl \
  libsodium-dev \
  libxml2-dev \
  zlib1g-dev \
  pkg-config \
  && rm -rf /var/lib/apt/lists/*

# Install R packages
RUN install2.r --error --skipinstalled --ncpus -1 \
  remotes \
  && R -e "remotes::install_github('rstudio/plumber')" \
  && R -e "install.packages('sn', repos='http://cran.rstudio.com/')" \
  && rm -rf /tmp/downloaded_packages

# Stage 2: Create a minimal final image
FROM rocker/r-ver:4.3

# Copy only necessary files from the builder stage
COPY --from=builder /usr/local/lib/R/site-library /usr/local/lib/R/site-library

# Copy your API files
COPY routes.R /api/plumber.R
COPY ./R /api/R

# Expose ports for Plumber API
EXPOSE 8000

# Command to run Plumber when the container starts
CMD ["R", "-e", "pr <- plumber::plumb('/api/plumber.R'); pr$run(host='0.0.0.0', port=8000)"]