// `data-processing.js`

const DataProcessing = {
    getAvailableModels(fontData) {
        if (!fontData || !fontData.model) {
            console.error('Font data or models missing.');
            return [];
        }
        const availableModels = Object.keys(fontData.model);
        console.log('Available Models:', availableModels);
        return availableModels;
    },

    getAvailableEpochs(fontData, model) {
        if (!fontData || !fontData.model[model]) {
            console.error(`Model "${model}" not found in font data.`);
            return [];
        }
        const availableEpochs = fontData.model[model].epochsRange || [];
        console.log(`Available Epochs for ${model}:`, availableEpochs);
        return availableEpochs;
    },

    getAvailableSamples(fontData, model) {
        if (!fontData || !fontData.model[model]) {
            console.error(`Model "${model}" not found in font data.`);
            return [];
        }
        const availableSamples = fontData.model[model].samplesRange || [];
        console.log(`Available Samples for ${model}:`, availableSamples);
        return availableSamples;
    },

    getAvailableFontNumbers(fontData, model) {
        if (!fontData || !fontData.model[model]) {
            console.error(`Model "${model}" not found in font data.`);
            return [];
        }
        const availableFontNumbers = fontData.model[model].fontNumberRange || [];
        console.log(`Available Font Numbers for ${model}:`, availableFontNumbers);
        return availableFontNumbers;
    },

    processAllModels(fontData) {
        const modelsData = {};
        const availableModels = this.getAvailableModels(fontData);

        availableModels.forEach(model => {
            modelsData[model] = {
                availableEpochs: this.getAvailableEpochs(fontData, model),
                availableSamples: this.getAvailableSamples(fontData, model),
                availableFontNumbers: this.getAvailableFontNumbers(fontData, model),
            };
        });

        console.log('Processed Models Data:', modelsData);
        return modelsData;
    }
};