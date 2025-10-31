# GitHub Actions Deployment Setup

This repository includes a GitHub Actions workflow that automatically builds and deploys the Electric Book to the server template repository whenever changes are pushed to the `master`, `staging`, or `live` branches.

## Required Secrets

To enable the deployment workflow, you need to set up the following secret in your GitHub repository:

### DEPLOY_SSH_KEY

This should contain a private SSH key that has write access to the target repository (`alexmaughan/electric-book-server-template-automate`).

#### To set up the SSH key:

1. **Generate a new SSH key pair** (or use an existing one):
   ```bash
   ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f ~/.ssh/electric_book_deploy
   ```
   
2. **Add the public key as a deploy key to the TARGET repository**:
   - Go to the target repository: `https://github.com/alexmaughan/electric-book-server-template-automate`
   - Navigate to Settings → Deploy keys
   - Click "Add deploy key"
   - Title: "Electric Book Actions Deploy Key"
   - Key: Paste the contents of the `.pub` file (`~/.ssh/electric_book_deploy.pub`)
   - ✅ **Check "Allow write access"**
   - Click "Add key"

3. **Add the private key as a repository secret in the SOURCE repository**:
   - Go to THIS repository: `https://github.com/alexmaughan/electric-book-automate`
   - Navigate to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `DEPLOY_SSH_KEY`
   - Value: Paste the entire contents of the private key file (`~/.ssh/electric_book_deploy`) including the `-----BEGIN` and `-----END` lines

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

- **Permission denied (publickey)**: Make sure you added the public key as a **deploy key** to the target repository (`alexmaughan/electric-book-server-template-automate`) with **write access enabled**, not to your personal GitHub account
- **SSH Key Issues**: The deploy key must have write access enabled in the target repository settings
- **Repository Access**: Ensure the target repository exists and you have admin access to it to add deploy keys
- **Branch Issues**: The workflow will create the target branch if it doesn't exist in the destination repository
- **Build Failures**: Check that `npm run setup` and `npm run eb` commands work locally first