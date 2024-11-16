// data-processing.js
const DataProcessing = {
    getAvailableModels(fontData) {
        if (!fontData) {
            console.error('Font data is missing. Ensure it is fetched before accessing models.');
            return [];
        }
        return Object.keys(fontData.model);
    },
    getParametersForModel(fontData, selectedModel) {
        if (!fontData || !fontData.model[selectedModel]) {
            console.error(`Model "${selectedModel}" not found in the font data.`);
            return null;
        }
        return fontData.model[selectedModel];
    }
};