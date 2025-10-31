# GitHub Actions Deployment Setup

This repository includes a GitHub Actions workflow that automatically builds and deploys the Electric Book to the server template repository whenever changes are pushed to the `master`, `staging`, or `live` branches.

## Required Setup

### 1. Create the Target Repository

First, you need to create the target repository:
- Go to GitHub and create a new repository: `alexmaughan/electric-book-server-template-automate`
- Make it public or private (your choice)
- Initialize with a README or leave it empty
- The workflow will create the `public` directory structure as needed

### 2. Create a Personal Access Token

To enable the deployment workflow, you need to set up a GitHub Personal Access Token:

### DEPLOY_TOKEN

This should contain a GitHub Personal Access Token with write access to the target repository.

#### To set up the token:

1. **Create a Personal Access Token**:
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Name: "Electric Book Deploy Token"
   - Expiration: Choose your preferred expiration (90 days, 1 year, or no expiration)
   - Scopes: Select **`repo`** (Full control of private repositories)
   - Click "Generate token"
   - **Copy the token immediately** (you won't see it again!)

2. **Add the token as a repository secret in the SOURCE repository**:
   - Go to THIS repository: `https://github.com/alexmaughan/electric-book-automate`
   - Navigate to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `DEPLOY_TOKEN`
   - Value: Paste the Personal Access Token you copied

#### Benefits of using Personal Access Token over SSH:
- More reliable in GitHub Actions environment
- Easier to set up and troubleshoot
- No need for SSH key management
- Works with both public and private repositories

## How the Workflow Works

1. **Trigger**: Runs on pushes to `master`, `staging`, or `live` branches
2. **Build**: 
   - Installs Node.js and Ruby dependencies
   - Runs `npm run setup` to install all dependencies
   - Runs `npm run eb -- output --dontserve=true --deploy=true` to generate the site
3. **Deploy**:
   - Clones the target repository (`alexmaughan/electric-book-server-template-automate`)
   - Switches to the same branch name as the source branch
   - Replaces the contents of `public/electric-book/` with the newly built site from `_site/electric-book/`
   - Commits and pushes the changes with message: `Deploy from {branch} on {repo}`

## Manual Triggering

The workflow can also be triggered manually from the GitHub Actions tab using the "workflow_dispatch" trigger.

## Troubleshooting

- **Repository does not exist**: First create the target repository `alexmaughan/electric-book-server-template-automate` on GitHub
- **Authentication failed**: Make sure you created a Personal Access Token with `repo` scope and added it as `DEPLOY_TOKEN` secret
- **Token expired**: Personal Access Tokens can expire - check if yours needs to be renewed
- **Branch Issues**: The workflow will create the target branch if it doesn't exist in the destination repository
- **Build Failures**: Check that `npm run setup` and `npm run eb` commands work locally first