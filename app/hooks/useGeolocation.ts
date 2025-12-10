import { useState, useEffect } from 'react'

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  error: string | null
  loading: boolean
}

function getErrorMessage(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED: {
      return 'Location permission denied'
    }
    case error.POSITION_UNAVAILABLE: {
      return 'Location information unavailable'
    }
    case error.TIMEOUT: {
      return 'Location request timed out'
    }
    default: {
      return 'Unable to get your location'
    }
  }
}

function createErrorState(errorMessage: string): GeolocationState {
  return {
    latitude: null,
    longitude: null,
    error: errorMessage,
    loading: false,
  }
}

function createSuccessState(position: GeolocationPosition): GeolocationState {
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    error: null,
    loading: false,
  }
}

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  })

  useEffect(() => {
    const hasGeolocation = typeof navigator !== 'undefined' && 'geolocation' in navigator

    if (!hasGeolocation) {
      setState(createErrorState('Geolocation is not supported by your browser'))
      return
    }

    // eslint-disable-next-line sonarjs/no-intrusive-permissions
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState(createSuccessState(position))
      },
      (error) => {
        setState(createErrorState(getErrorMessage(error)))
      },
      {
        enableHighAccuracy: true,
        timeout: 10_000,
        maximumAge: 300_000, // Cache for 5 minutes
      }
    )
  }, [])

  return state
}
