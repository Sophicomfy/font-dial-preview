// `presets.js`

const Presets = {
    assetsBaseUrl: 'https://assets.lttrcorp.com/',
    jsonUrl: 'https://assets.lttrcorp.com/2024-10-01-ai-font-tester/ai_testing_samples/fonts_data.json',
    defaultPresets: {
        model: 'LTTR24-FT',
        epochs: 1100,
        samples: 30,
        fontNumber: '0006'
    }
};

// server-fetch-json.js
const Server = {
    async fetchFontData(url) {
        if (!url) {
            throw new Error('A valid JSON URL must be provided.');
        }
        try {
            const response = await fetch(url);
            const fontData = await response.json();
            console.log('server-fetch-json fontData:', fontData);
            return fontData;
        } catch (error) {
            console.error('Error fetching font data:', error);
            throw error;
        }
    }
};

// data-process-json.js

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

    getAvailableEpochs(fontData, model) {
        if (!fontData || !fontData.model[model]) {
            console.error(`Model "${model}" not found in font data.`);
            return [];
        }
        const availableEpochs = fontData.model[model].epochsRange || [];
        console.log(`data-process-json availableEpochs for ${model}:`, availableEpochs);
        return availableEpochs;
    },

    getAvailableSamples(fontData, model) {
        if (!fontData || !fontData.model[model]) {
            console.error(`Model "${model}" not found in font data.`);
            return [];
        }
        const availableSamples = fontData.model[model].samplesRange || [];
        console.log(`data-process-json availableSamples for ${model}:`, availableSamples);
        return availableSamples;
    },

    getAvailableFontNumbers(fontData, model) {
        if (!fontData || !fontData.model[model]) {
            console.error(`Model "${model}" not found in font data.`);
            return [];
        }
        const availableFontNumbers = fontData.model[model].fontNumberRange || [];
        console.log(`data-process-json availableFontNumbers for ${model}:`, availableFontNumbers);
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

        console.log('data-process-json modelsData:', modelsData);
        return modelsData;
    }
};

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

// ui-dropdown-population.js

class UIDropdownPopulation {
    constructor(uiState) {
        this.uiState = uiState;
        this.dropdownMappings = {
            "font-selection": {
                selectedKey: "selectedFontNumber",
                availableKey: "fontNumberRange",
            },
            "model-selection": {
                selectedKey: "selectedModel",
                availableKey: "availableModels",
            },
            "epochs-selection": {
                selectedKey: "selectedEpoch",
                availableKey: "epochsRange",
            },
            "samples-selection": {
                selectedKey: "selectedSample",
                availableKey: "samplesRange",
            },
        };
        this.dropdownElements = this.initializeDropdowns();
    }

    initializeDropdowns() {
        const dropdownElements = {};
        Object.keys(this.dropdownMappings).forEach((key) => {
            dropdownElements[key] = document.querySelector(`.${key}`);
        });
        return dropdownElements;
    }

    populateDropdowns() {
        Object.keys(this.dropdownMappings).forEach((key) => {
            const { selectedKey, availableKey } = this.dropdownMappings[key];
            const dropdownElement = this.dropdownElements[key];
            const selectedValue = this.uiState.selectedOptions[selectedKey];
            const availableOptions = this.uiState.availableOptions[availableKey];
            this.populateDropdown(dropdownElement, availableOptions, selectedValue);
        });
    }

    populateDropdown(element, options, selectedValue) {
        const selectedItem = element.querySelector(".selected-item");
        const optionsContainer = element.querySelector(".dropdown-options");

        // Update the selected item
        selectedItem.textContent = selectedValue;
        selectedItem.setAttribute("data", selectedValue);

        // Clear previous options
        this.clearDropdownOptions(optionsContainer);

        // Populate new options
        options.forEach((option) => {
            const optionElement = document.createElement("div");
            optionElement.classList.add("dropdown-option");
            optionElement.setAttribute("data-value", option);
            optionElement.textContent = option;
            if (option === selectedValue) {
                optionElement.setAttribute("attr", "selected");
            }
            optionsContainer.appendChild(optionElement);
        });

        // Make options visible
        optionsContainer.classList.remove("hidden");
    }

    clearDropdownOptions(optionsContainer) {
        while (optionsContainer.firstChild) {
            optionsContainer.removeChild(optionsContainer.firstChild);
        }
    }

    logDropdownState() {
        console.log("UI Dropdown State:", this.uiState);
    }
}

// ui-dropdown-interactions.js

(function() {
    document.addEventListener('click', function(event) {
        const dropdownOptions = document.querySelectorAll('.dropdown-options');
        if (event.target.matches('.dropdown-option')) {
            const clickedOption = event.target;
            const parentDropdownOptions = clickedOption.closest('.dropdown-options');
            if (parentDropdownOptions) {
                const newSelectedOption = parentDropdownOptions.getAttribute('data');
                const newSelectedOptionValue = clickedOption.getAttribute('data-value');
                console.log(`newSelectedOption = ${newSelectedOption}`);
                console.log(`newSelectedOptionValue = ${newSelectedOptionValue}`);
                const optionSelectedEvent = new CustomEvent('optionSelected', {
                    detail: {
                        newSelectedOption,
                        newSelectedOptionValue
                    }
                });
                document.dispatchEvent(optionSelectedEvent);
                parentDropdownOptions.classList.add('hidden');
            }
        } else if (event.target.matches('.selected-item')) {
            const selectedItem = event.target;
            const siblingDropdown = selectedItem.parentElement.querySelector('.dropdown-options');
            if (siblingDropdown.classList.contains('hidden')) {
                dropdownOptions.forEach(function(dropdown) {
                    dropdown.classList.add('hidden');
                });
                siblingDropdown.classList.remove('hidden');
                console.log(`Dropdown for ${siblingDropdown.getAttribute('data')} shown`);
            } else {
                siblingDropdown.classList.add('hidden');
                console.log(`Dropdown for ${siblingDropdown.getAttribute('data')} hidden`);
            }
        } else {
            dropdownOptions.forEach(function(dropdown) {
                if (!dropdown.classList.contains('hidden')) {
                    dropdown.classList.add('hidden');
                    console.log(`Dropdown for ${dropdown.getAttribute('data')} hidden`);
                }
            });
        }
    });
})();

// main.js

(async function initializeApp() {
    try {
        const { assetsBaseUrl, jsonUrl, defaultPresets } = Presets;

        // Fetch font data from the server
        const fontData = await Server.fetchFontData(jsonUrl);

        // Process all models data
        const allModelsData = DataProcessing.processAllModels(fontData);
        console.log('main allModelsData:', allModelsData);

        // Initialize and manage UI state
        const uiManager = new UIManageState(fontData, defaultPresets);

        // Initialize dropdown population
        const dropdownPopulator = new UIDropdownPopulation(uiManager.uiState);

        // Populate dropdowns with the initial state
        dropdownPopulator.populateDropdowns();

        // Listen for `optionSelected` events
        document.addEventListener('optionSelected', (event) => {
            const { newSelectedOption, newSelectedOptionValue } = event.detail;
            console.log(`Option selected: ${newSelectedOption} = ${newSelectedOptionValue}`);

            // Update UI state and repopulate dropdowns
            uiManager.updateUIState(newSelectedOption, newSelectedOptionValue);
            dropdownPopulator.populateDropdowns();
        });

    } catch (error) {
        console.error('Error initializing the app:', error);
    }
})();