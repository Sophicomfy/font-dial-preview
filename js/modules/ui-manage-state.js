class lttraiUIManageState {
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
        this.logUIState();
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
            const optionKeyMap = {
                'epochsRange': 'selectedEpoch',
                'samplesRange': 'selectedSample',
                'fontNumberRange': 'selectedFontNumber'
            };
            const selectedOptionKey = optionKeyMap[newSelectedOption] || newSelectedOption;
            this.uiState.selectedOptions[selectedOptionKey] = newSelectedOptionValue;
        }
        this.logUIState();
    }

    logUIState() {
        console.log('lttraiUIManageState output uiState:', JSON.parse(JSON.stringify(this.uiState)));
    }
}
