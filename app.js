// Route Generator App
let extractedAddresses = [];
let apiKey = localStorage.getItem('claude_api_key');

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
const manualInputBtn = document.getElementById("manualInputBtn");
const manualInputSection = document.getElementById("manualInputSection");
const manualAddressInput = document.getElementById("manualAddressInput");
const processManualBtn = document.getElementById("processManualBtn");
const cancelManualBtn = document.getElementById("cancelManualBtn");
const apiKeySection = document.getElementById("apiKeySection");
const apiKeyInput = document.getElementById("apiKeyInput");
const saveApiKeyBtn = document.getElementById("saveApiKeyBtn");
const uploadSection = document.querySelector(".upload-section");
const changeApiKeyBtn = document.getElementById("changeApiKeyBtn");

// Initialize app
function initApp() {
  if (apiKey) {
    apiKeySection.classList.add("hidden");
    uploadSection.classList.remove("hidden");
  } else {
    apiKeySection.classList.remove("hidden");
    uploadSection.classList.add("hidden");
  }
}

// Event Listeners
fileInput.addEventListener("change", handleFileSelect);
generateRouteBtn.addEventListener("click", generateRoute);
retryBtn.addEventListener("click", resetApp);
manualInputBtn.addEventListener("click", showManualInput);
processManualBtn.addEventListener("click", processManualAddresses);
cancelManualBtn.addEventListener("click", hideManualInput);
saveApiKeyBtn.addEventListener("click", saveApiKey);
changeApiKeyBtn.addEventListener("click", changeApiKey);

// Save API key
function saveApiKey() {
  const key = apiKeyInput.value.trim();
  if (!key) {
    alert("Please enter an API key");
    return;
  }
  
  apiKey = key;
  localStorage.setItem('claude_api_key', key);
  apiKeyInput.value = "";
  initApp();
}

// Change API key
function changeApiKey() {
  if (confirm("Are you sure you want to change your API key?")) {
    apiKey = null;
    localStorage.removeItem('claude_api_key');
    resetApp();
    initApp();
  }
}

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

// Process images with Claude API
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

      const addresses = await extractAddressesFromImage(file);
      extractedAddresses.push(...addresses);

      processedFiles++;
    }

    updateProgress(totalFiles, totalFiles);

    if (extractedAddresses.length > 0) {
      displayResults();
    } else {
      showError(
        "No addresses found in the selected images. Please try different screenshots or use manual input."
      );
    }
  } catch (error) {
    console.error("Processing error:", error);
    if (error.message.includes("401")) {
      showError(
        "Invalid API key. Please check your Claude API key and try again."
      );
    } else if (error.message.includes("429")) {
      showError(
        "Rate limit exceeded. Please wait a moment and try again."
      );
    } else {
      showError(
        "An error occurred while processing the images. Please try again."
      );
    }
  }
}

// Extract addresses from image using Claude API
async function extractAddressesFromImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        // Convert to base64
        const base64Data = e.target.result.split(',')[1];
        
        // Call Claude API
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 1000,
            messages: [{
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Extract all delivery addresses from this image. Return ONLY the addresses, one per line, in the order they appear. Include street number, street name, and any apartment/unit numbers. Do not include city names, timestamps, or any other information. If no addresses are found, return "NO_ADDRESSES_FOUND".'
                },
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: file.type,
                    data: base64Data
                  }
                }
              ]
            }]
          })
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.content[0].text;
        
        console.log("Claude API response:", text);
        
        if (text === "NO_ADDRESSES_FOUND") {
          resolve([]);
        } else {
          // Split by newlines and clean up
          const addresses = text.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0 && !line.includes('NO_ADDRESSES_FOUND'));
          resolve(addresses);
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsDataURL(file);
  });
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
  extractedAddresses.forEach((address) => {
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
  manualInputSection.classList.add("hidden");
}

// Show manual input section
function showManualInput() {
  errorSection.classList.add("hidden");
  manualInputSection.classList.remove("hidden");
  manualAddressInput.focus();
}

// Hide manual input section
function hideManualInput() {
  manualInputSection.classList.add("hidden");
  manualAddressInput.value = "";
}

// Process manually entered addresses
function processManualAddresses() {
  const text = manualAddressInput.value.trim();
  if (!text) {
    showError("Please enter at least one address");
    return;
  }
  
  // Split by newlines and filter empty lines
  extractedAddresses = text.split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  if (extractedAddresses.length > 0) {
    manualInputSection.classList.add("hidden");
    displayResults();
  } else {
    showError("No valid addresses entered");
  }
}

// Initialize on load
initApp();