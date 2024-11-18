const UIMakeHtmlElements = {
    initializeDropdowns(fontData, defaultPresets) {
        this.populateAllDropdowns(
            fontData,
            defaultPresets.model,
            defaultPresets.epochs,
            defaultPresets.samples,
            defaultPresets.fontNumber
        );
    },

    populateAllDropdowns(fontData, selectedModel, selectedEpoch, selectedSample, selectedFontNumber) {
        const availableModels = DataProcessing.getAvailableModels(fontData);
        const availableEpochs = DataProcessing.getAvailableEpochs(fontData, selectedModel);
        const availableSamples = DataProcessing.getAvailableSamples(fontData, selectedModel);
        const availableFontNumbers = DataProcessing.getAvailableFontNumbers(fontData, selectedModel);

        this.populateDropdown('.model-selection .dropdown', availableModels, selectedModel);
        this.populateDropdown('.epochs-selection .dropdown', availableEpochs, selectedEpoch);
        this.populateDropdown('.samples-selection .dropdown', availableSamples, selectedSample);
        this.populateDropdown('.font-selection .dropdown', availableFontNumbers, selectedFontNumber);
    },

    populateDropdown(containerSelector, options, selectedValue) {
        const container = document.querySelector(containerSelector);
        if (!container) {
            console.error(`Container not found for selector: ${containerSelector}`);
            return;
        }

        const selectedItem = container.querySelector('.selected-item');
        const dropdownOptions = container.querySelector('.dropdown-options');

        if (!selectedItem || !dropdownOptions) {
            console.error('Dropdown structure is incomplete.');
            return;
        }

        selectedItem.textContent = selectedValue || 'Default';
        selectedItem.setAttribute('data', selectedValue || '');

        dropdownOptions.innerHTML = '';

        options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'dropdown-option';
            optionElement.textContent = option;
            optionElement.setAttribute('data-value', option);

            if (option === selectedValue) {
                optionElement.classList.add('selected');
            }

            dropdownOptions.appendChild(optionElement);
        });
    },

    handleNewSelection(fontData, selectedPresets, newSelectedOption, dropdownType) {
        // Update the relevant preset value based on dropdownType
        switch (dropdownType) {
            case 'model':
                selectedPresets.model = newSelectedOption;
                break;
            case 'epochs':
                selectedPresets.epochs = parseInt(newSelectedOption, 10);
                break;
            case 'samples':
                selectedPresets.samples = parseInt(newSelectedOption, 10);
                break;
            case 'fontNumber':
                selectedPresets.fontNumber = newSelectedOption;
                break;
            default:
                console.error('Unknown dropdown type:', dropdownType);
        }

        // Rebuild dropdowns based on the updated presets
        this.populateAllDropdowns(
            fontData,
            selectedPresets.model,
            selectedPresets.epochs,
            selectedPresets.samples,
            selectedPresets.fontNumber
        );
    }
};