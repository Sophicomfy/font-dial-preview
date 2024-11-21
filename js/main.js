// main.js

(async function initializeApp() {
    try {
        const { assetsBaseUrl, jsonUrl, defaultPresets } = Presets;

        // Fetch font data from the server
        const fontData = await Server.fetchFontData(jsonUrl);

        // Process all models data
        const allModelsData = DataProcessing.processAllModels(fontData);
        console.log('main allModelsData:', allModelsData);

        // Initialize and manage UI state
        const uiManager = new UIManageState(fontData, defaultPresets);

        // Initialize dropdown population
        const dropdownPopulator = new UIDropdownPopulation(uiManager.uiState);

        // Populate dropdowns with the initial state
        dropdownPopulator.populateDropdowns();

        // Listen for `optionSelected` events
        document.addEventListener('optionSelected', (event) => {
            const { newSelectedOption, newSelectedOptionValue } = event.detail;
            console.log(`Option selected: ${newSelectedOption} = ${newSelectedOptionValue}`);

            // Update UI state and repopulate dropdowns
            uiManager.updateUIState(newSelectedOption, newSelectedOptionValue);
            dropdownPopulator.populateDropdowns();
        });

    } catch (error) {
        console.error('Error initializing the app:', error);
    }
})();