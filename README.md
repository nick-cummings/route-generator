# Route Generator

A Next.js web application that extracts delivery addresses from screenshots and generates optimized routes in Google Maps.

## Features

- 📸 **Screenshot Upload**: Upload multiple delivery screenshots
- 🤖 **Multi-Provider AI**: Choose between Claude (Anthropic) or GPT-4 (OpenAI) for address extraction
- 🗺️ **Route Generation**: Automatically generates Google Maps routes with up to 10 stops per chunk
- ✅ **Address Validation**: Validates addresses using Nominatim geocoding API with visual status indicators
- 📍 **Geocode Support**: Toggle between parsed text and geocode coordinates for more accurate routing
- ✏️ **Address Editing**: Edit addresses directly with a convenient modal interface
- 💾 **Auto-Save**: Extracted addresses persist in localStorage - survives page refresh
- 🌐 **Bilingual**: Full support for English and Spanish languages
- 🔒 **Privacy First**: API key stored locally in browser, never sent to our servers
- 📱 **Mobile-Friendly**: Responsive design works on all devices

## Getting Started

### Prerequisites

- Node.js 18+ or Bun runtime installed
- AI API key from one of:
  - Claude API key from [console.anthropic.com](https://console.anthropic.com)
  - OpenAI API key from [platform.openai.com](https://platform.openai.com)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/nick-cummings/route-generator.git
cd route-generator
```

2. Install dependencies:

```bash
npm install
# or with bun
bun install
```

3. Run the development server:

```bash
npm run dev
# or with bun
bun run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

5. Select your AI provider (Anthropic or OpenAI) and enter your API key when prompted

## Usage

### Basic Workflow

1. **Upload Screenshots**: Click "Select Screenshots" to upload delivery route images
2. **Extract Addresses**: The app will automatically extract addresses using your chosen AI provider
3. **Validate Addresses**: Addresses are automatically validated using the Nominatim geocoding API
4. **Review & Edit**: Review the extracted addresses with visual validation indicators
5. **Generate Routes**: Click "Open in Google Maps" to open routes (automatically split into chunks of 10 stops)

### Address Management

Each address has a three-dot menu with these options:

- **Open**: Opens the address in Google Maps search
- **Copy**: Copies address to clipboard (copies geocode coordinates when geocode mode is enabled)
- **Use Geocode / Use Address**: Toggle between using parsed text or geocode coordinates for routing
  - When enabled, a blue location pin icon appears on the address
  - Geocode mode provides more accurate routing when Google Maps misinterprets address text
- **Edit**: Modify the address text in a modal dialog
- **Remove**: Delete the address from the route

### Additional Features

- **Language Toggle**: Switch between English and Spanish using the language selector
- **Auto-Save**: All extracted addresses are automatically saved to your browser's localStorage
- **Route Chunks**: Long routes are automatically split into chunks of 10 stops (Google Maps limit)
- **Geolocation**: First route uses your current location as the starting point (if granted)

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

After deployment, you can optionally add API keys as environment variables in Vercel (or users can enter them in the browser):

1. Go to your project settings in Vercel dashboard
2. Navigate to "Environment Variables"
3. Add one or both:
   - `ANTHROPIC_API_KEY = your-anthropic-api-key-here`
   - `OPENAI_API_KEY = your-openai-api-key-here`
4. Redeploy for changes to take effect

**Note**: If you don't set these environment variables, users will be prompted to enter their own API keys in the browser (stored locally).

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify (requires build command adjustment)
- Railway
- Render
- Self-hosted with Node.js

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Runtime**: Node.js or Bun
- **Styling**: Tailwind CSS
- **AI Providers**:
  - Claude API (Anthropic) - claude-3-haiku-20240307
  - OpenAI API - gpt-4o
- **Geocoding**: Nominatim API (OpenStreetMap)
- **Maps**: Google Maps Direction API
- **Storage**: Browser localStorage for API keys and extracted addresses
- **Internationalization**: Custom translation system (English/Spanish)
- **Deployment**: Vercel (recommended)

## License

MIT
