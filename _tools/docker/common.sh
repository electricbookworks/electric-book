

export CONTAINER_REGISTRY="ghcr.io"
export IMAGE_NAME="electricbookworks/electric-book"
export IMAGE_TAG=$(git rev-parse --short HEAD) # first 7 characters of the current commit hash

export DOCKER_USERNAME="bertuss"
export DOCKER_TOKEN="${GITHUB_TOKEN}"
