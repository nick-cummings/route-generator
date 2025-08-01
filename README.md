# Route Generator

A simple web app that extracts addresses from screenshots and generates Google Maps routes.

## How to Use

1. **Open the app** in Safari on your iPhone
2. **Tap "Select Screenshots"** to choose images from your photo library
3. **Wait for OCR processing** - the app will extract text from each image
4. **Review extracted addresses** - they appear in the order found
5. **Tap "Open in Google Maps"** to generate your route

## Features

- Works directly in Safari (no installation needed)
- Processes multiple screenshots at once
- Maintains address order from your screenshots
- One-tap navigation to Google Maps
- All processing happens on your device (privacy-focused)

## Requirements

- iPhone with Safari browser
- Screenshots containing delivery addresses
- Internet connection (for loading OCR library)

## Tips for Best Results

- Take clear screenshots with addresses visible
- Include full addresses when possible (street, city, state, zip)
- The app recognizes common address formats:
  - 123 Main Street, City, ST 12345
  - 456 Oak Ave
  - 789 Elm Road Apt 4B

## Limitations

- Maximum 10 waypoints in Google Maps (free tier limit)
- OCR accuracy depends on screenshot quality
- No route optimization (addresses stay in original order)

## Deployment

Simply host the files on any static web server:
- GitHub Pages
- Netlify
- Vercel
- Any web hosting service

All files (HTML, CSS, JS) are static and require no server-side processing.