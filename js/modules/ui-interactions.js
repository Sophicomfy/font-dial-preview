// `ui-interactions.js`

const UIInteractions = {
    attachDropdownListeners(dropdownSelector, fontData, selectedPresets, callback) {
        // Remove existing event listeners by cloning the parent container
        const dropdownContainers = document.querySelectorAll(dropdownSelector);

        dropdownContainers.forEach(container => {
            const clonedContainer = container.cloneNode(true);
            container.parentNode.replaceChild(clonedContainer, container);
        });

        // Re-select the new containers and attach event listeners
        const dropdownOptions = document.querySelectorAll(`${dropdownSelector} .dropdown-option`);

        dropdownOptions.forEach(option => {
            option.addEventListener('click', () => {
                const newSelectedOption = option.getAttribute('data-value');
                const dropdownType = dropdownSelector.split('-')[0].replace('.', '');

                // Call the provided callback function
                if (typeof callback === 'function') {
                    callback(newSelectedOption, dropdownType);
                }
            });
        });

        console.log(`Event listeners attached for dropdown: ${dropdownSelector}`);
    }
};