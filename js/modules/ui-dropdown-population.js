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
        console.log('lttraiUIDropdownPopulation: Initialized dropdown elements', this.dropdownElements);
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
        console.log('lttraiUIDropdownPopulation: Dropdowns populated with current uiState', uiState);
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

        console.log(`lttraiUIDropdownPopulation: Updated dropdown for ${element.className} with selected value ${selectedValue}`);
    }

    clearDropdownOptions(optionsContainer) {
        while (optionsContainer.firstChild) {
            optionsContainer.removeChild(optionsContainer.firstChild);
        }
    }

    updateStateAndPopulate(newUiState) {
        this.uiState = newUiState;
        this.populateDropdowns();
        console.log('lttraiUIDropdownPopulation: State updated and dropdowns repopulated', newUiState);
    }

    logDropdownState() {
        console.log("lttraiUIDropdownPopulation: Current UI Dropdown State", this.uiState);
    }
}