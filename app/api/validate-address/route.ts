import { NextRequest, NextResponse } from 'next/server'

const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/search'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')

  if (!address) {
    return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 })
  }

  try {
    const params = new URLSearchParams({
      q: address,
      format: 'json',
      limit: '1',
      addressdetails: '1',
    })

    const response = await fetch(`${NOMINATIM_ENDPOINT}?${params.toString()}`, {
      headers: {
        'User-Agent': 'RouteGeneratorApp/1.0',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Nominatim API error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = (await response.json()) as unknown[]

    return NextResponse.json({
      verified: data.length > 0,
      results: data,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Validation failed' },
      { status: 500 }
    )
  }
}
