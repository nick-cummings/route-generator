/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_HAS_ANTHROPIC_KEY: process.env.ANTHROPIC_API_KEY ? 'true' : 'false',
    NEXT_PUBLIC_HAS_OPENAI_KEY: process.env.OPENAI_API_KEY ? 'true' : 'false',
  },
}

module.exports = nextConfig
