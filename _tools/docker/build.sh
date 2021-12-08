#!/usr/bin/env bash
set -eu
set -o pipefail

SCRIPTS_DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$SCRIPTS_DIR" ]]; then SCRIPTS_DIR="$PWD"; fi

. "$SCRIPTS_DIR/common.sh"

echo "Building Docker image ${IMAGE_NAME}:${IMAGE_TAG}"
docker build -t "${IMAGE_NAME}:${IMAGE_TAG}" .

echo "Authenticating and pushing image to Github Container registry"
echo "${DOCKER_TOKEN}" | docker login ghcr.io -u "${DOCKER_USERNAME}" --password-stdin 
docker push "${IMAGE_NAME}:${IMAGE_TAG}"
