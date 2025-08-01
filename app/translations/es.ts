export const es = {
  common: {
    routeGenerator: 'Generador de Rutas',
    extractAddresses: 'Extrae direcciones de capturas de pantalla y crea rutas',
    loading: 'Cargando...',
    error: 'Error',
    tryAgain: 'Intentar de nuevo',
    reset: 'Reiniciar',
    startOver: 'Empezar de nuevo',
    clearAll: 'Borrar todo',
    change: 'Cambiar',
  },
  apiKey: {
    title: 'Configurar Claude API',
    description:
      'Ingresa tu clave API de Claude para extraer direcciones de imágenes. Tu clave se almacena localmente y nunca se envía a nuestros servidores.',
    placeholder: 'sk-ant-...',
    save: 'Guardar clave API',
    configured: 'Clave API: Configurada',
    getKey: 'Obtén tu clave API en',
  },
  fileUpload: {
    clickToSelect: 'Haz clic para seleccionar capturas',
    imageSelected: 'imagen seleccionada',
    imagesSelected: 'imágenes seleccionadas',
    readyToProcess: 'captura lista para procesar',
    screenshotsReady: 'capturas listas para procesar',
    clickAgain: 'Haz clic de nuevo para agregar más capturas',
  },
  extraction: {
    extractAddresses: 'Extraer Direcciones',
    processing: 'Procesando imágenes...',
    noAddressesFound: 'No se encontraron direcciones',
  },
  addressList: {
    routePlan: 'Plan de Ruta',
    stops: 'paradas',
    stop: 'parada',
    yourLocation: 'Tu Ubicación Actual',
    start: 'Inicio',
    allRemoved: 'Todas las direcciones han sido eliminadas',
    removeAddress: 'Eliminar esta dirección',
  },
  actions: {
    openInGoogleMaps: 'Abrir en Google Maps',
    generateRoute: 'Generar Ruta',
    avoidHighways: 'Evitar autopistas',
  },
  errors: {
    missingImage: 'Falta la imagen',
    missingApiKey:
      'Falta la clave API. Por favor proporciona una clave API o configura la variable de entorno ANTHROPIC_API_KEY.',
    invalidApiKey: 'Clave API inválida',
    rateLimitExceeded: 'Límite de velocidad excedido. Por favor intenta de nuevo más tarde.',
    failedToProcess: 'Error al procesar la imagen',
    anErrorOccurred: 'Ocurrió un error',
  },
}
