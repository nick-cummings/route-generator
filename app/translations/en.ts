export const en = {
  common: {
    routeGenerator: 'Route Generator',
    extractAddresses: 'Extract addresses from screenshots and create routes',
    loading: 'Loading...',
    error: 'Error',
    tryAgain: 'Try again',
    reset: 'Reset',
    startOver: 'Start Over',
    clearAll: 'Clear all',
    change: 'Change',
  },
  apiKey: {
    title: 'Setup Claude API',
    description:
      'Enter your Claude API key to extract addresses from images. Your key is stored locally and never sent to our servers.',
    placeholder: 'sk-ant-...',
    save: 'Save API Key',
    configured: 'API Key: Configured',
    getKey: 'Get your API key from',
  },
  fileUpload: {
    clickToSelect: 'Click to select screenshots',
    imageSelected: 'image selected',
    imagesSelected: 'images selected',
    readyToProcess: 'screenshot ready to process',
    screenshotsReady: 'screenshots ready to process',
    clickAgain: 'Click again to add more screenshots',
  },
  extraction: {
    extractAddresses: 'Extract Addresses',
    processing: 'Processing images...',
    noAddressesFound: 'No addresses found',
  },
  addressList: {
    routePlan: 'Route Plan',
    stops: 'stops',
    stop: 'stop',
    yourLocation: 'Your Current Location',
    start: 'Start',
    allRemoved: 'All addresses have been removed',
    removeAddress: 'Remove this address',
  },
  actions: {
    openInGoogleMaps: 'Open in Google Maps',
    generateRoute: 'Generate Route',
    copyLink: 'Copy Link',
    linkCopied: 'Link Copied!',
  },
  errors: {
    missingImage: 'Missing image',
    missingApiKey:
      'Missing API key. Please provide an API key or set ANTHROPIC_API_KEY environment variable.',
    invalidApiKey: 'Invalid API key',
    rateLimitExceeded: 'Rate limit exceeded. Please try again later.',
    failedToProcess: 'Failed to process image',
    anErrorOccurred: 'An error occurred',
  },
}
