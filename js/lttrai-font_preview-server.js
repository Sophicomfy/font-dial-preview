// Global variable to store the fetched data
let fontData = null;

// Function to fetch the font data (JSON) from the server
async function fetchFontData() {
    const jsonUrl = 'https://assets.lttrcorp.com/ai_testing_samples/fonts_data.json';
    try {
        const response = await fetch(jsonUrl);
        fontData = await response.json();
        console.log('Font data fetched successfully');
        return fontData;
    } catch (error) {
        console.error('Error fetching font data:', error);
        throw error;
    }
}

// Function to get the list of available models
function getAvailableModels() {
    if (!fontData) {
        console.error('Font data not available. Please ensure data is fetched.');
        return [];
    }
    return Object.keys(fontData.model);  // Extract available models
}

// Function to get the parameters (epochs, samples, font numbers) for a selected model
function getParametersForModel(selectedModel) {
    if (!fontData || !fontData.model[selectedModel]) {
        console.error('Selected model not found in font data.');
        return null;
    }
    return fontData.model[selectedModel].parameters;  // Return parameters for the selected model
}

// Function to find the corresponding font based on the selected model, epochs, samples, and font number
function findFont(selectedModel, epochs, samples, fontNumber) {
    if (!fontData || !fontData.model[selectedModel]) {
        console.error('Selected model not found in font data.');
        return null;
    }

    const fonts = fontData.model[selectedModel].generatedFonts;
    return fonts.find(font => {
        const regex = new RegExp(`${selectedModel}-${epochs}-${samples}-${fontNumber}`);
        return regex.test(font.fontUrl);
    });
}

// Function to inject @font-face rule dynamically into the document
function injectFontFaceRule(fontFamily, fontUrl) {
    const existingStyleElement = document.querySelector(`#font-style-${fontFamily}`);

    // If the font-face rule already exists, skip injecting again
    if (!existingStyleElement) {
        const styleElement = document.createElement('style');
        styleElement.id = `font-style-${fontFamily}`;
        styleElement.innerText = `
            @font-face {
                font-family: '${fontFamily}';
                src: url('${fontUrl}') format('woff2');
            }
        `;
        document.head.appendChild(styleElement);
    }
}
