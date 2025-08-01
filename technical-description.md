# Technical Description - Route Generator MVP

## Overview

Route Generator is a client-side web application that processes screenshots containing delivery addresses and generates a Google Maps route URL with all addresses as waypoints in the order they appear.

## Architecture

### Technology Stack

- **Frontend**: HTML5 + Vanilla JavaScript
- **OCR Engine**: Tesseract.js (v4.x) via CDN
- **Deployment**: Static web hosting (GitHub Pages, Netlify, etc.)

### Core Components

1. **Image Input Handler**

   - HTML file input with `multiple` and `accept="image/*"` attributes
   - FileReader API for image processing
   - Display selected images as thumbnails

2. **OCR Processor**

   - Sequential processing of images through Tesseract.js
   - Progress indicators during OCR operations
   - Text extraction with basic preprocessing

3. **Address Extractor**

   - Regular expression patterns for common address formats
   - Maintains original order from screenshots
   - Basic validation (must contain street number and name)

4. **Route URL Builder**
   - Google Maps URL format: `https://www.google.com/maps/dir/`
   - Addresses encoded as waypoints
   - Automatic opening in Maps app on iOS

## Implementation Details

### File Structure

```
route-generator/
├── index.html          # Main application page
├── app.js             # Core application logic
├── styles.css         # Basic styling
└── README.md          # Usage instructions
```

### Key Functions

**processImages(files)**

- Accepts FileList from input element
- Converts images to base64 for Tesseract
- Returns array of extracted text blocks

**extractAddresses(textArray)**

- Applies regex patterns to find addresses
- Filters out non-address text
- Returns ordered list of addresses

**generateMapsURL(addresses)**

- Constructs Google Maps direction URL
- Properly encodes address parameters
- Limits to Google's maximum waypoints (10 for free tier)

### Address Pattern Matching

```javascript
// Example patterns
/\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd)/gi
/\d+\s+[A-Za-z\s]+,\s*[A-Za-z\s]+,\s*[A-Z]{2}\s*\d{5}/gi
```

## User Flow

1. User navigates to web app on iPhone Safari
2. Taps "Select Photos" button
3. Chooses screenshots from camera roll
4. App displays processing status
5. Extracted addresses shown in order
6. "Open in Maps" button generates and opens route

## MVP Limitations

- No address validation against real locations
- Limited to Google Maps waypoint restrictions
- No persistent storage of routes
- Basic error handling only
- No route optimization (maintains screenshot order)

## Performance Considerations

- Tesseract.js runs in web worker (non-blocking)
- Image processing done sequentially to manage memory
- Lazy loading of Tesseract language data
- Mobile-optimized for iPhone Safari

## Security & Privacy

- All processing happens client-side
- No data sent to external servers
- No cookies or local storage in MVP
- Images processed in memory only

## Testing Requirements

- iPhone Safari compatibility
- Multiple screenshot formats
- Various address formats
- OCR accuracy validation
- Maps app handoff verification
