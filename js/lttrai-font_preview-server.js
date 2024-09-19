// Global variable to store the fetched data
let fontData = null;

// Function to fetch the font data (JSON) from the server
async function fetchFontData() {
    const jsonUrl = 'https://assets.lttrcorp.com/ai_testing_samples/fonts_data.json';
    try {
        const response = await fetch(jsonUrl);
        fontData = await response.json();
        console.log('`JSON` with the font data fetched from the server successfully and parsed into the `fontData`');
        return fontData;
    } catch (error) {
        console.error('Error fetching `JSON` file:', error);
        throw error;
    }
}

// Function to get the list of available models
function getAvailableModels() {
    if (!fontData) {
        console.error('`JSON` file not available. Please ensure data is fetched.');
        return [];
    }
    return Object.keys(fontData.model);  // Extract available models from JSON
}

// Function to get the parameters (epochs, samples, font numbers) for a selected model
function getParametersForModel(selectedModel) {
    if (!fontData || !fontData.model[selectedModel]) {
        console.error('Selected model not found in `JSON` file.');
        return null;
    }
    return fontData.model[selectedModel];  // Return full model parameters (epochsRange, samplesRange, fontNumberRange)
}

// Function to find the corresponding font based on the selected model, epochs, samples, and font number
function findFont(selectedModel, selectedEpoch, selectedSample, selectedFontNumber) {
    if (!fontData || !fontData.model[selectedModel]) {
        console.error('Selected model not found in `JSON` file.');
        return null;
    }

    const fonts = fontData.model[selectedModel].generatedFonts;

    // Search for the font based on selectedEpoch, selectedSample, and selectedFontNumber
    const font = Object.values(fonts).find(font =>
        font.epochs === selectedEpoch &&
        font.samples === selectedSample &&
        font.fontNumber === selectedFontNumber
    );

    if (font && font.fontUrl) {
        // Log and return the found font URL
        console.log('Matching font found:', font.fontUrl);
        return font.fontUrl;  // Return the URL of the matching font
    } else {
        console.error('Matching font not found in `JSON` file.');
        return null;
    }
}