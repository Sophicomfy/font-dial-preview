// ui-manage-state.js

class UIManageState {
    constructor(fontData, defaultPresets) {
        this.fontData = fontData;
        this.defaultPresets = defaultPresets;
        this.uiState = {
            selectedOptions: { ...defaultPresets },
            availableOptions: {
                availableModels: Object.keys(fontData.model),
                epochsRange: [],
                samplesRange: [],
                fontNumberRange: [],
            },
        };
        this.initializeUIState();
    }

    initializeUIState() {
        const { model, epochs, samples, fontNumber } = this.defaultPresets;
        this.updateAvailableOptions(model);
        this.uiState.selectedOptions = {
            selectedModel: model,
            selectedEpoch: epochs,
            selectedSample: samples,
            selectedFontNumber: fontNumber,
        };
        console.log('ui-state-management availableOptions:', this.uiState);
    }

    updateAvailableOptions(selectedModel) {
        const modelData = this.fontData.model[selectedModel];
        this.uiState.availableOptions = {
            availableModels: Object.keys(this.fontData.model),
            epochsRange: modelData.epochsRange,
            samplesRange: modelData.samplesRange,
            fontNumberRange: modelData.fontNumberRange,
        };
    }

    updateUIState(newSelectedOption, newSelectedOptionValue) {
        if (newSelectedOption === 'availableModels') {
            this.uiState.selectedOptions.selectedModel = newSelectedOptionValue;
            this.updateAvailableOptions(newSelectedOptionValue);

            this.uiState.selectedOptions.selectedEpoch = this.uiState.availableOptions.epochsRange[0];
            this.uiState.selectedOptions.selectedSample = this.uiState.availableOptions.samplesRange[0];
            this.uiState.selectedOptions.selectedFontNumber = this.uiState.availableOptions.fontNumberRange[0];
        } else {
            this.uiState.selectedOptions[newSelectedOption] = newSelectedOptionValue;
        }
        console.log('ui-state-management availableOptions:', this.uiState);
    }

    logUIState() {
        console.log('Current UI State:', this.uiState);
    }
}