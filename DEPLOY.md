# 🚀 Quick Vercel Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (free at vercel.com)
- Your Claude API key

## Step 1: Push to GitHub
```bash
git add .
git commit -m "feat: Next.js route generator with Claude API"
git push origin main
```

## Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your `route-generator` repository
4. Vercel will auto-detect Next.js and bun
5. Click "Deploy" (wait ~2 minutes)

## Step 3: Add API Key (Optional but Recommended)

To avoid users needing to enter their own API key:

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Environment Variables"
3. Add new variable:
   - Name: `ANTHROPIC_API_KEY`
   - Value: `your-claude-api-key-here`
   - Environment: ✓ Production, ✓ Preview, ✓ Development
4. Click "Save"
5. Go to "Deployments" → Click "..." → "Redeploy"

## Step 4: Done! 🎉

Your app is now live at: `https://your-project-name.vercel.app`

## Alternative: CLI Deployment

```bash
# Install Vercel CLI
bun add -g vercel

# Deploy
vercel

# Follow prompts, then add env variable:
vercel env add ANTHROPIC_API_KEY
```

## Troubleshooting

- **Build fails**: Check Vercel logs for errors
- **API not working**: Ensure environment variable is set correctly
- **CORS errors**: Should not happen with this setup!

## Updating

Future updates are automatic:
```bash
git push origin main
# Vercel auto-deploys changes!
```