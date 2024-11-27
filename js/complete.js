const lttraiAppPresets = {
    assetsBaseUrl: 'https://assets.lttrcorp.com/',
    jsonUrl: 'https://assets.lttrcorp.com/2024-10-01-ai-font-tester/ai_testing_samples/fonts_data.json',
    defaultPresets: {
        model: 'LTTR24-FT',
        epochs: 1100,
        samples: 30,
        fontNumber: '0006'
    }
};

const lttraiAppServer = {
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

function lttraiUIDropdownInteractions() {
    document.addEventListener('click', function (event) {
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
                dropdownOptions.forEach(function (dropdown) {
                    dropdown.classList.add('hidden');
                });
                siblingDropdown.classList.remove('hidden');
                console.log(`Dropdown for ${siblingDropdown.getAttribute('data')} shown`);
            } else {
                siblingDropdown.classList.add('hidden');
                console.log(`Dropdown for ${siblingDropdown.getAttribute('data')} hidden`);
            }
        } else {
            dropdownOptions.forEach(function (dropdown) {
                if (!dropdown.classList.contains('hidden')) {
                    dropdown.classList.add('hidden');
                    console.log(`Dropdown for ${dropdown.getAttribute('data')} hidden`);
                }
            });
        }
    });
}

// ui-manage-state.js

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


class lttraiUIDropdownPopulation {
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
        console.log('ui-dropdown-population: Initialized dropdown elements', this.dropdownElements);
    }

    initializeDropdowns() {
        const dropdownElements = {};
        Object.keys(this.dropdownMappings).forEach((key) => {
            dropdownElements[key] = document.querySelector(`.${key}`);
        });
        return dropdownElements;
    }

    populateDropdowns(uiState = this.uiState) {
        Object.keys(this.dropdownMappings).forEach((key) => {
            const { selectedKey, availableKey } = this.dropdownMappings[key];
            const dropdownElement = this.dropdownElements[key];
            const selectedValue = uiState.selectedOptions[selectedKey];
            const availableOptions = uiState.availableOptions[availableKey];
            this.populateDropdown(dropdownElement, availableOptions, selectedValue);
        });
        console.log('ui-dropdown-population: Dropdowns populated with current uiState', uiState);
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

        console.log(`ui-dropdown-population: Updated dropdown for ${element.className} with selected value ${selectedValue}`);
    }

    clearDropdownOptions(optionsContainer) {
        while (optionsContainer.firstChild) {
            optionsContainer.removeChild(optionsContainer.firstChild);
        }
    }

    updateStateAndPopulate(newUiState) {
        this.uiState = newUiState;
        this.populateDropdowns();
        console.log('ui-dropdown-population: State updated and dropdowns repopulated', newUiState);
    }

    logDropdownState() {
        console.log("ui-dropdown-population: Current UI Dropdown State", this.uiState);
    }
}

const lttraiUIFontManagement = {
    findFont(uiState, fontData) {
        const { selectedModel, selectedEpoch, selectedSample, selectedFontNumber } = uiState.selectedOptions;
 
        if (!fontData?.model?.[selectedModel]) {
            throw new Error(`Model "${selectedModel}" not found`);
        }
 
        const fonts = fontData.model[selectedModel].generatedFonts;
        const fontKey = `${selectedFontNumber}-${selectedEpoch}-${selectedSample}`;
        
        const font = fonts[fontKey];
        
        if (!font) {
            throw new Error(`Font not found for ${fontKey}`);
        }
 
        return {
            woff2: font.woff2Url,
            otf: font.otfUrl
        };
    },
 
    generateFontUrls(fontUrls, baseUrl) {
        if (!fontUrls?.woff2 || !fontUrls?.otf || !baseUrl) {
            throw new Error('Invalid font URLs or baseUrl');
        }
 
        const normalizeUrl = (url) => {
            const path = url.replace('./web/', '');
            return new URL(path, baseUrl).toString();
        };
 
        return {
            woff2: normalizeUrl(fontUrls.woff2),
            otf: normalizeUrl(fontUrls.otf)
        };
    },
 
    async applyFontToPreview(woff2Url) {
        if (!woff2Url) {
            throw new Error('Invalid woff2Url');
        }
 
        const fontFamily = this.generateFontFamilyName(woff2Url);
        const font = new FontFace(fontFamily, `url(${woff2Url})`);
        
        try {
            await font.load();
            document.fonts.add(font);
 
            const previewElement = document.querySelector('.font-preview[data-lttrface-preview]');
            if (!previewElement) {
                throw new Error('Preview element not found');
            }
 
            previewElement.style.fontFamily = `${fontFamily}, sans-serif`;
 
        } catch (error) {
            throw new Error(`Font application failed: ${error.message}`);
        }
    },
 
    generateFontFamilyName(fontUrl) {
        const sanitize = (str) => str.replace(/[^a-z0-9-]/gi, '-');
        const fileName = fontUrl.split('/').pop().replace('.woff2', '');
        return `preview-${sanitize(fileName)}`;
    },
 
    async configureDownloadButton(otfUrl) {
        const downloadButton = document.querySelector('.button--lttrai--download-font');
        if (!otfUrl || !downloadButton) {
            throw new Error('Invalid otfUrl or button not found');
        }
 
        try {
            const response = await fetch(otfUrl, { method: 'HEAD' });
            if (!response.ok) {
                throw new Error(`Invalid font URL: ${response.status}`);
            }
 
            downloadButton.href = otfUrl;
            downloadButton.download = otfUrl.split('/').pop();
 
        } catch (error) {
            throw new Error(`Download configuration failed: ${error.message}`);
        }
    }
 };

(async function lttraiAppOrchestrate () {
    try {
        const { assetsBaseUrl, jsonUrl, defaultPresets } = lttraiAppPresets;

        // Fetch font data from the server
        const fontData = await lttraiAppServer.fetchFontData(jsonUrl);

        // Initialize and manage UI state
        const uiManager = new lttraiUIManageState(fontData, defaultPresets);

        // Initialize dropdown population
        const dropdownPopulator = new lttraiUIDropdownPopulation(uiManager.uiState);

        // Populate dropdowns with the initial state
        dropdownPopulator.populateDropdowns();

        // Initialize dropdown interactions
        lttraiUIDropdownInteractions();

        // Define a function to update the font based on the current uiState
        async function updateFont() {
            const fontUrls = lttraiUIFontManagement.findFont(uiManager.uiState, fontData);

            if (fontUrls) {
                const { woff2, otf } = lttraiUIFontManagement.generateFontUrls(fontUrls, assetsBaseUrl);

                await lttraiUIFontManagement.applyFontToPreview(woff2);

                await lttraiUIFontManagement.configureDownloadButton(otf);
            } else {
                console.error('Font URLs not found for the current selection.');
            }
        }

        // Apply the font initially
        await updateFont();

        // Listen for `optionSelected` events
        document.addEventListener('optionSelected', async (event) => {
            const { newSelectedOption, newSelectedOptionValue } = event.detail;

            // Update UI state
            uiManager.updateUIState(newSelectedOption, newSelectedOptionValue);

            // Update dropdownPopulator's uiState
            dropdownPopulator.uiState = uiManager.uiState;

            // Repopulate dropdowns with the updated state
            dropdownPopulator.populateDropdowns();

            // Update the font based on the new uiState
            await updateFont();
        });

    } catch (error) {
        console.error('Error initializing the app:', error);
    }
})();