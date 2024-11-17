// ui-make-html-elements.js namespace
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
    }
};