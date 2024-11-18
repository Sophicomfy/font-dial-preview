// `ui-make-html-elements.js`

const UIMakeHtmlElements = {
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

        console.log(`Dropdown populated for selector: ${containerSelector} with selected value: ${selectedValue}`);
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

        console.log('All dropdowns populated with data from DataProcessing module.');
    }
};