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