import { Anthropic, APIError } from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

type ApiProvider = 'anthropic' | 'openai'

async function parseFormData(request: NextRequest) {
  const formData = await request.formData()
  const image = formData.get('image') as File | null
  const provider = (formData.get('provider') as ApiProvider) || 'anthropic'
  const apiKey =
    (formData.get('apiKey') as string) ||
    (provider === 'openai' ? process.env.OPENAI_API_KEY : process.env.ANTHROPIC_API_KEY)

  return { image, apiKey, provider }
}

async function convertImageToBase64(image: File): Promise<string> {
  const bytes = await image.arrayBuffer()
  const buffer = Buffer.from(bytes)
  return buffer.toString('base64')
}

const EXTRACTION_PROMPT =
  'Extract all delivery addresses from this image. Return ONLY the street addresses (number and street name), one per line, in the order they appear. Include apartment/unit numbers if present. DO NOT include city names, state names, zip codes, timestamps, delivery instructions, or any other information. Each line should contain ONLY the street address. For example: "2802 East Comstock Avenue" not "2802 East Comstock Avenue, NAMPA". If no addresses are found, return "NO_ADDRESSES_FOUND".'

async function extractAddressesFromImageAnthropic(
  anthropic: Anthropic,
  image: File,
  base64: string
): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: EXTRACTION_PROMPT,
          },
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: image.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
              data: base64,
            },
          },
        ],
      },
    ],
  })

  const [content] = response.content
  return 'text' in content ? content.text : ''
}

async function extractAddressesFromImageOpenAI(
  openai: OpenAI,
  image: File,
  base64: string
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: EXTRACTION_PROMPT,
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:${image.type};base64,${base64}`,
            },
          },
        ],
      },
    ],
  })

  return response.choices[0]?.message?.content || ''
}

function filterValidAddresses(text: string): string[] {
  if (text === 'NO_ADDRESSES_FOUND') {
    return []
  }

  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => {
      if (line.length === 0 || line.includes('NO_ADDRESSES_FOUND')) return false
      const words = line.split(' ')
      if (words.length === 1) return false
      return /^\d/.test(line)
    })
}

function handleApiError(error: unknown): NextResponse {
  console.error('API error:', error)

  if (error instanceof APIError) {
    if (error.status === 401) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    } else if (error.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }
  }

  return NextResponse.json({ error: 'Failed to process image' }, { status: 500 })
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { image, apiKey, provider } = await parseFormData(request)

    if (!image) {
      return NextResponse.json({ error: 'Missing image' }, { status: 400 })
    }

    if (!apiKey) {
      return NextResponse.json(
        {
          error: `Missing API key. Please provide an API key or set ${provider === 'openai' ? 'OPENAI_API_KEY' : 'ANTHROPIC_API_KEY'} environment variable.`,
        },
        { status: 400 }
      )
    }

    const base64 = await convertImageToBase64(image)
    let text: string

    if (provider === 'openai') {
      const openai = new OpenAI({ apiKey })
      text = await extractAddressesFromImageOpenAI(openai, image, base64)
    } else {
      const anthropic = new Anthropic({ apiKey })
      text = await extractAddressesFromImageAnthropic(anthropic, image, base64)
    }

    const addresses = filterValidAddresses(text)

    return NextResponse.json({ addresses })
  } catch (error) {
    return handleApiError(error)
  }
}
