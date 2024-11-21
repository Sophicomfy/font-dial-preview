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