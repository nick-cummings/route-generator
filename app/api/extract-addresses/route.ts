import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    const apiKey = formData.get('apiKey') as string || process.env.ANTHROPIC_API_KEY

    if (!image) {
      return NextResponse.json(
        { error: 'Missing image' },
        { status: 400 }
      )
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing API key. Please provide an API key or set ANTHROPIC_API_KEY environment variable.' },
        { status: 400 }
      )
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')

    // Initialize Claude client
    const anthropic = new Anthropic({
      apiKey: apiKey,
    })

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Extract all delivery addresses from this image. Return ONLY the addresses, one per line, in the order they appear. Include street number, street name, and any apartment/unit numbers. Do not include city names, timestamps, or any other information. If no addresses are found, return "NO_ADDRESSES_FOUND".'
          },
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: image.type as any,
              data: base64
            }
          }
        ]
      }]
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    
    if (text === 'NO_ADDRESSES_FOUND') {
      return NextResponse.json({ addresses: [] })
    }

    // Parse addresses
    const addresses = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.includes('NO_ADDRESSES_FOUND'))

    return NextResponse.json({ addresses })

  } catch (error) {
    console.error('API error:', error)
    
    if (error instanceof Anthropic.APIError) {
      if (error.status === 401) {
        return NextResponse.json(
          { error: 'Invalid API key' },
          { status: 401 }
        )
      } else if (error.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    )
  }
}