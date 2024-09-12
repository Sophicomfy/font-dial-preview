// Base URL for accessing the fonts on the server
const assetsBaseUrl = 'https://assets.lttrcorp.com/ai_testing_samples/';

// Function to construct the font URL based on selected model, epoch, sample, and font number
function constructFontUrl(selectedModel, selectedEpoch, selectedSample, selectedFontNumber) {
    return `${assetsBaseUrl}${selectedModel}/NewFont-${selectedModel}-${selectedEpoch}-${selectedSample}-${selectedFontNumber}.woff2`;
}

// Function to download the font and apply it to the preview element
function downloadAndDisplayFont(fontUrl) {
    const fontFamily = extractFontFamilyFromUrl(fontUrl);

    // Inject the @font-face rule if it doesn't exist
    if (!document.getElementById(`font-style-${fontFamily}`)) {
        injectFontFaceRule(fontFamily, fontUrl);
    }

    // Apply the font to the preview element
    const previewElement = document.querySelector('[data-lttrface-preview]');
    if (previewElement) {
        previewElement.style.fontFamily = fontFamily;
    } else {
        console.error('Preview element not found.');
    }
}

// Helper function to extract a unique font-family name from the font URL
function extractFontFamilyFromUrl(fontUrl) {
    const fontFileName = fontUrl.split('/').pop(); // Extract the file name from the URL
    const fontFamily = fontFileName.replace('.woff2', ''); // Remove the .woff2 extension
    return `lttrface-preview-${fontFamily}`;  // Return a unique font-family name
}

// Function to inject a dynamic @font-face rule into the document head
function injectFontFaceRule(fontFamily, fontUrl) {
    const styleElement = document.createElement('style');
    styleElement.id = `font-style-${fontFamily}`;  // Set a unique ID for the style element
    styleElement.innerText = `
        @font-face {
            font-family: '${fontFamily}';
            src: url('${fontUrl}') format('woff2');
        }
    `;
    document.head.appendChild(styleElement);  // Append the new style to the document head
}
