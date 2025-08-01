# Route Generator - MVP Overview

A simple web application that extracts delivery addresses from screenshots and generates a Google Maps route URL.

## How It Works

1. **Take screenshots** of your delivery address list
2. **Open the web app** on your iPhone (Safari)
3. **Select the screenshots** from your photo library
4. **OCR extracts addresses** in order
5. **Get a Google Maps URL** with all addresses as waypoints
6. **Tap to open** in Google Maps app (with CarPlay support)

## MVP Features

**Core Functionality:**

- Select multiple photos from iPhone camera roll
- Extract text from images using OCR
- Identify addresses in the extracted text
- Generate Google Maps route URL with addresses in order
- One-tap navigation to open in Maps app

**Technical Approach:**

- Single HTML page with JavaScript
- Tesseract.js for client-side OCR (no server needed)
- Simple regex patterns for address extraction
- Google Maps URL scheme for multi-stop routes

## Benefits

- **No installation** - works directly in Safari
- **Privacy-focused** - all processing happens on your device
- **Simple to use** - just select photos and get your route
- **No external dependencies** - runs entirely in the browser

## Future Enhancements (Post-MVP)

- PWA features (install to home screen, offline support)
- Route optimization algorithms
- Address validation and correction
- Batch processing improvements
- Save/export route functionality
