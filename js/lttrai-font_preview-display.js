// Base URL for accessing the fonts on the server
const assetsBaseUrl = 'https://assets.lttrcorp.com/';

// Function to download the font and apply it to the preview element
function downloadAndDisplayFont(fontUrl) {
    // Replace './web/' with the correct base URL
    const updatedFontUrl = fontUrl.replace('./web/', assetsBaseUrl);

    const fontFamily = extractFontFamilyFromUrl(updatedFontUrl);

    // Inject the @font-face rule if it doesn't exist
    if (!document.getElementById(`font-style-${fontFamily}`)) {
        injectFontFaceRule(fontFamily, updatedFontUrl);
        console.log(`@font-face rule injected for ${fontFamily}`);
    } else {
        console.log(`@font-face rule already exists for ${fontFamily}`);
    }

    // Apply the font to the preview element
    const previewElement = document.querySelector('[data-lttrface-preview]');
    if (previewElement) {
        previewElement.style.fontFamily = fontFamily;
        console.log(`Font family ${fontFamily} applied to the preview element.`);
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

// Function to trigger the preview update based on the selected model, epoch, sample, and font number
function triggerPreviewUpdate(selectedModel, selectedEpoch, selectedSample, selectedFontNumber) {
    const fontUrl = window.findFont(selectedModel, selectedEpoch, selectedSample, selectedFontNumber); // Assumes findFont is in lttrai-font_preview-server.js
    if (fontUrl) {
        // Pass the fontUrl to download and display the font
        downloadAndDisplayFont(fontUrl); 
    } else {
        console.error('Font URL could not be found for the selected combination.');
    }
}