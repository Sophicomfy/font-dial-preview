// data-parse-json.js

const DataProcessing = {
    getAvailableModels(fontData) {
        if (!fontData || !fontData.model) {
            console.error('Font data or models missing.');
            return [];
        }
        const availableModels = Object.keys(fontData.model);
        console.log('data-process-json availableModels:', availableModels);
        return availableModels;
    },

    getAvailableEpochs(fontData, availableModel) {
        if (!fontData || !fontData.model[availableModel]) {
            console.error(`Available Model "${availableModel}" not found in font data.`);
            return [];
        }
        const availableEpochs = fontData.model[availableModel].epochsRange || [];
        console.log(`data-process-json availableEpochs for ${availableModel}:`, availableEpochs);
        return availableEpochs;
    },

    getAvailableSamples(fontData, availableModel) {
        if (!fontData || !fontData.model[availableModel]) {
            console.error(`Available Model "${availableModel}" not found in font data.`);
            return [];
        }
        const availableSamples = fontData.model[availableModel].samplesRange || [];
        console.log(`data-process-json availableSamples for ${availableModel}:`, availableSamples);
        return availableSamples;
    },

    getAvailableFontNumbers(fontData, availableModel) {
        if (!fontData || !fontData.model[availableModel]) {
            console.error(`Available Model "${availableModel}" not found in font data.`);
            return [];
        }
        const availableFontNumbers = fontData.model[availableModel].fontNumberRange || [];
        console.log(`data-process-json availableFontNumbers for ${availableModel}:`, availableFontNumbers);
        return availableFontNumbers;
    },

    processAllModels(fontData) {
        const modelsData = {};
        const availableModels = this.getAvailableModels(fontData);

        availableModels.forEach(availableModel => {
            modelsData[availableModel] = {
                availableEpochs: this.getAvailableEpochs(fontData, availableModel),
                availableSamples: this.getAvailableSamples(fontData, availableModel),
                availableFontNumbers: this.getAvailableFontNumbers(fontData, availableModel),
            };
        });

        console.log('data-process-json modelsData:', modelsData);
        return modelsData;
    }
};