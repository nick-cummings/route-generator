# Route Generator

A Next.js web application that extracts delivery addresses from screenshots and generates optimized routes in Google Maps.

## Features

- 📸 Upload multiple delivery screenshots
- 🤖 Uses Claude AI to accurately extract addresses
- 🗺️ Generates Google Maps routes with all addresses
- 🔒 API key stored locally in browser
- 📱 Mobile-friendly responsive design

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Claude API key from [console.anthropic.com](https://console.anthropic.com)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/nick-cummings/route-generator.git
cd route-generator
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

5. Enter your Claude API key when prompted

## Usage

1. Click "Select Screenshots" to upload delivery route images
2. The app will extract addresses using Claude AI
3. Review the extracted addresses
4. Click "Open in Google Maps" to generate the route

## Deployment

### Vercel (Recommended)

#### Method 1: Deploy with Vercel CLI

```bash
# Install Vercel CLI globally
bun add -g vercel

# Deploy (follow the prompts)
vercel

# For production deployment
vercel --prod
```

#### Method 2: Deploy via GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. Click "Deploy" (Vercel auto-detects Next.js and bun)

### Environment Variables

After deployment, you'll need to add your Claude API key in Vercel:

1. Go to your project settings in Vercel dashboard
2. Navigate to "Environment Variables"
3. Add: `ANTHROPIC_API_KEY = your-api-key-here`
4. Redeploy for changes to take effect

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify (requires build command adjustment)
- Railway
- Render
- Self-hosted with Node.js

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **AI**: Claude API (Anthropic)
- **Deployment**: Vercel

## License

MIT
