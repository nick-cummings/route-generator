# Route Generator MVP - Todo List

## High Priority Tasks

- [ ] Set up basic HTML page with file input for multiple photo selection
- [ ] Integrate Tesseract.js CDN for client-side OCR
- [ ] Implement OCR processing to extract text from selected images
- [ ] Create address extraction logic using regex patterns
- [ ] Build Google Maps URL with addresses as waypoints in order
- [ ] Test on iPhone Safari with real screenshots

## Medium Priority Tasks

- [ ] Add basic UI to display extracted addresses and route URL
- [ ] Implement error handling for OCR failures

## Implementation Notes

### HTML Structure

- Simple file input with multiple selection
- Results display area
- Loading indicators
- "Open in Maps" button

### JavaScript Functions

- Image file handling
- OCR processing with Tesseract.js
- Address pattern matching
- URL generation

### Testing Checklist

- [ ] Multiple image selection works on iPhone
- [ ] OCR accurately extracts text
- [ ] Addresses are identified correctly
- [ ] Order is preserved from screenshots
- [ ] Google Maps URL opens properly
- [ ] Works in Safari on iPhone
