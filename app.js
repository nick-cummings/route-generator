// Route Generator App
let extractedAddresses = [];

// DOM Elements
const fileInput = document.getElementById("fileInput");
const imagePreview = document.getElementById("imagePreview");
const processingSection = document.getElementById("processingSection");
const processingStatus = document.getElementById("processingStatus");
const progressFill = document.getElementById("progressFill");
const resultsSection = document.getElementById("resultsSection");
const addressList = document.getElementById("addressList");
const generateRouteBtn = document.getElementById("generateRouteBtn");
const errorSection = document.getElementById("errorSection");
const errorMessage = document.getElementById("errorMessage");
const retryBtn = document.getElementById("retryBtn");

// Event Listeners
fileInput.addEventListener("change", handleFileSelect);
generateRouteBtn.addEventListener("click", generateRoute);
retryBtn.addEventListener("click", resetApp);

// Handle file selection
function handleFileSelect(event) {
  const files = Array.from(event.target.files);
  if (files.length === 0) return;

  displayImagePreviews(files);
  processImages(files);
}

// Display image previews
function displayImagePreviews(files) {
  imagePreview.innerHTML = "";
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.className = "preview-image";
      imagePreview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}

// Process images with OCR
async function processImages(files) {
  showProcessingSection();
  extractedAddresses = [];

  try {
    const totalFiles = files.length;
    let processedFiles = 0;

    for (const file of files) {
      updateProgress(processedFiles, totalFiles);
      processingStatus.textContent = `Processing image ${
        processedFiles + 1
      } of ${totalFiles}...`;

      const text = await performOCR(file);
      const addresses = extractAddresses(text);
      extractedAddresses.push(...addresses);

      processedFiles++;
    }

    updateProgress(totalFiles, totalFiles);

    if (extractedAddresses.length > 0) {
      displayResults();
    } else {
      showError(
        "No addresses found in the selected images. Please try different screenshots."
      );
    }
  } catch (error) {
    console.error("Processing error:", error);
    showError(
      "An error occurred while processing the images. Please try again."
    );
  }
}

// Perform OCR on a single image
async function performOCR(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const result = await Tesseract.recognize(e.target.result, "eng", {
          logger: (m) => console.log(m),
        });
        resolve(result.data.text);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsDataURL(file);
  });
}

// Extract addresses from text
function extractAddresses(text) {
  const addresses = [];
  const lines = text.split("\n").filter((line) => line.trim());

  // Address patterns
  const patterns = [
    // Full address with city, state, zip
    /\d+\s+[A-Za-z0-9\s\.,'-]+,\s*[A-Za-z\s]+,\s*[A-Z]{2}\s*\d{5}(-\d{4})?/gi,
    // Street address with common suffixes
    /\d+\s+[A-Za-z0-9\s\.,'-]+\s+(Street|St\.?|Avenue|Ave\.?|Road|Rd\.?|Boulevard|Blvd\.?|Drive|Dr\.?|Lane|Ln\.?|Way|Court|Ct\.?|Circle|Cir\.?|Place|Pl\.?|Parkway|Pkwy\.?)/gi,
    // Apartment/unit numbers
    /\d+\s+[A-Za-z0-9\s\.,'-]+\s+(Apt|Apartment|Unit|Suite|Ste|#)\s*[A-Za-z0-9]+/gi,
  ];

  // Check each line for address patterns
  for (const line of lines) {
    const cleanLine = line.trim();
    for (const pattern of patterns) {
      const matches = cleanLine.match(pattern);
      if (matches) {
        matches.forEach((match) => {
          // Clean up the address
          const cleanAddress = match.trim().replace(/\s+/g, " ");
          // Avoid duplicates
          if (!addresses.includes(cleanAddress)) {
            addresses.push(cleanAddress);
          }
        });
        break; // Stop checking patterns once we find a match
      }
    }
  }

  return addresses;
}

// Update progress bar
function updateProgress(current, total) {
  const percentage = (current / total) * 100;
  progressFill.style.width = `${percentage}%`;
}

// Display results
function displayResults() {
  processingSection.classList.add("hidden");
  resultsSection.classList.remove("hidden");

  addressList.innerHTML = "";
  extractedAddresses.forEach((address, index) => {
    const li = document.createElement("li");
    li.textContent = address;
    addressList.appendChild(li);
  });
}

// Generate Google Maps route
function generateRoute() {
  if (extractedAddresses.length === 0) {
    showError("No addresses to route.");
    return;
  }

  // Google Maps URL format
  let mapsUrl = "https://www.google.com/maps/dir/";

  // Add each address as a waypoint
  extractedAddresses.forEach((address, index) => {
    if (index > 0) mapsUrl += "/";
    mapsUrl += encodeURIComponent(address);
  });

  // Open in new window/tab (will open Maps app on iOS if available)
  window.open(mapsUrl, "_blank");
}

// Show processing section
function showProcessingSection() {
  processingSection.classList.remove("hidden");
  resultsSection.classList.add("hidden");
  errorSection.classList.add("hidden");
  progressFill.style.width = "0%";
}

// Show error
function showError(message) {
  processingSection.classList.add("hidden");
  resultsSection.classList.add("hidden");
  errorSection.classList.remove("hidden");
  errorMessage.textContent = message;
}

// Reset app
function resetApp() {
  fileInput.value = "";
  imagePreview.innerHTML = "";
  extractedAddresses = [];
  processingSection.classList.add("hidden");
  resultsSection.classList.add("hidden");
  errorSection.classList.add("hidden");
}
