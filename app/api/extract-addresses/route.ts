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
            text: 'Extract all delivery addresses from this image. Return ONLY the street addresses (number and street name), one per line, in the order they appear. Include apartment/unit numbers if present. DO NOT include city names, state names, zip codes, timestamps, delivery instructions, or any other information. Each line should contain ONLY the street address. For example: "2802 East Comstock Avenue" not "2802 East Comstock Avenue, NAMPA". If no addresses are found, return "NO_ADDRESSES_FOUND".'
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

    // Parse addresses and filter out common city names or single words
    const addresses = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => {
        // Remove empty lines and the no addresses found message
        if (line.length === 0 || line.includes('NO_ADDRESSES_FOUND')) return false
        
        // Remove lines that are just single words (likely city names)
        const words = line.split(' ')
        if (words.length === 1) return false
        
        // Remove lines that don't start with a number (addresses typically start with numbers)
        if (!/^\d/.test(line)) return false
        
        return true
      })

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