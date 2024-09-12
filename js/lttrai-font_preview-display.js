// Base URL for accessing the fonts on the server
const assetsBaseUrl = 'https://assets.lttrcorp.com/ai_testing_samples/_lttr_24_base/';

// Function to construct the font URL based on selected model, epochs, samples, and font number
function constructFontUrl(selectedModel, selectedEpoch, selectedSample, selectedFontNumber) {
    const fontUrl = `${assetsBaseUrl}NewFont-${selectedModel}-${selectedEpoch}-${selectedSample}-${selectedFontNumber}.woff2`;
    return fontUrl;
}

// Function to download the font and inject it into the page for preview
function downloadAndDisplayFont(fontUrl) {
    const fontFamily = extractFontFamilyFromUrl(fontUrl);

    // Check if the @font-face rule already exists
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

// Helper function to extract a font family name from the URL (to create a unique font-family name)
function extractFontFamilyFromUrl(fontUrl) {
    const fontFileName = fontUrl.split('/').pop(); // Extract the file name from the URL
    const fontFamily = fontFileName.replace('.woff2', ''); // Remove the .woff2 extension
    return `lttrface-preview-${fontFamily}`;  // Return a unique font-family name
}

// Function to inject the @font-face rule dynamically into the document
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
