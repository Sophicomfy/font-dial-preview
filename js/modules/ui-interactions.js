// `ui-interactions.js`
const UIInteractions = {
    attachDropdownListeners(dropdownSelector, callback) {
        const dropdownElements = document.querySelectorAll(`${dropdownSelector} .dropdown-option`);

        dropdownElements.forEach(option => {
            option.addEventListener('click', () => {
                const newSelectedOption = option.getAttribute('data-value');
                console.log('New Selected Option:', newSelectedOption);

                if (typeof callback === 'function') {
                    callback(newSelectedOption);
                }
            });
        });
    }
};
