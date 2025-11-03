# GitHub Actions Deployment Setup

This repository includes a GitHub Actions workflow that automatically builds and deploys this project's web output to a specified book server repository whenever changes are pushed to any one of the branches defined for `DEPLOY_BRANCHES` in `.env.deploy`.

## Setup

For security reasons complete steps 1 and 2 below in one interupted sequence without saving the Personal Access Token anywhere other than as the secret value in step 2. This prevents the token ever being viewed again after this, even by yourself.

### 1. **Create a Personal Access Token**:
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Name: "Electric Book Deploy Token"
   - Set it to have no expiration
   - Scopes: Select **`repo`** (full control of private repositories)
   - Click "Generate token"
   - Copy the token. You only see this once. Don't store it anywhere else, or share with anyone.

### 2. **Add the token as a repository secret in this repo on GitHub**:
   - Go to this repository on GitHub
   - Navigate to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `DEPLOY_TOKEN`
   - Value: Paste the Personal Access Token you copied

### Benefits of using Personal Access Token over SSH:
- More reliable in GitHub Actions environment.
- Easier to set up and manage - no need for SSH key management.
- Works with both public and private repositories.
– Can be generated once and never viewed again.

## Deployment configuration

In `.env.deploy` configure the following:

1. The deployment repo. This is an [Electric Book Server](https://github.com/electricbookworks/electric-book-server-template) instance that serves publications from its `public` folder and is configured for its own continuous deployment. 
2. The deployment directory that will be pushed to the deployment repo's `public` directory. If the directory already exists, it will be replaced entirely by the new deployment.
3. The branches that will trigger deployments on new commits. The workflow will push to the same branch on the deployment repo, matching `main` to `master` and vica versa.
