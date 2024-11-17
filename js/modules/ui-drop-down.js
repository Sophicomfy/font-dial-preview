// ui-dropdown.js
const UIDropdown = {
    initializeDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');

        dropdowns.forEach(dropdown => {
            const selectedItem = dropdown.querySelector('.selected-item');
            const dropdownOptions = dropdown.querySelector('.dropdown-options');

            if (!selectedItem || !dropdownOptions) {
                console.error('Dropdown structure is incomplete.');
                return;
            }

            // Toggle dropdown visibility
            selectedItem.addEventListener('click', () => {
                dropdownOptions.classList.toggle('hidden');
            });

            // Handle option selection
            dropdownOptions.addEventListener('click', event => {
                const clickedOption = event.target.closest('.dropdown-option');
                if (clickedOption) {
                    selectedItem.textContent = clickedOption.textContent;
                    selectedItem.setAttribute('data', clickedOption.getAttribute('data-value'));

                    dropdownOptions.querySelectorAll('.dropdown-option').forEach(option => {
                        option.classList.remove('selected');
                    });
                    clickedOption.classList.add('selected');

                    dropdownOptions.classList.add('hidden');
                }
            });

            // Close dropdown if clicked outside
            document.addEventListener('click', event => {
                if (!dropdown.contains(event.target)) {
                    dropdownOptions.classList.add('hidden');
                }
            });
        });

        console.log('Dropdown interactions initialized.');
    }
};