(async function initializeApp() {
    try {
        const { assetsBaseUrl, jsonUrl, defaultPresets } = Presets;

        // Fetch font data from the server
        const fontData = await Server.fetchFontData(jsonUrl);

        // Initialize and manage UI state
        const uiManager = new lttraiUIManageState(fontData, defaultPresets);

        // Initialize dropdown population
        const dropdownPopulator = new lttraiUIDropdownPopulation(uiManager.uiState);

        // Populate dropdowns with the initial state
        dropdownPopulator.populateDropdowns();

        // Initialize dropdown interactions
        lttraiUIDropdownInteractions();

        // Define a function to update the font based on the current uiState
        async function updateFont() {
            const fontUrls = FontManagement.findFont(uiManager.uiState, fontData);

            if (fontUrls) {
                const { woff2, otf } = FontManagement.generateFontUrls(fontUrls, assetsBaseUrl);

                await FontManagement.applyFontToPreview(woff2);

                await FontManagement.configureDownloadButton(otf);
            } else {
                console.error('Font URLs not found for the current selection.');
            }
        }

        // Apply the font initially
        await updateFont();

        // Listen for `optionSelected` events
        document.addEventListener('optionSelected', async (event) => {
            const { newSelectedOption, newSelectedOptionValue } = event.detail;

            // Update UI state
            uiManager.updateUIState(newSelectedOption, newSelectedOptionValue);

            // Update dropdownPopulator's uiState
            dropdownPopulator.uiState = uiManager.uiState;

            // Repopulate dropdowns with the updated state
            dropdownPopulator.populateDropdowns();

            // Update the font based on the new uiState
            await updateFont();
        });

    } catch (error) {
        console.error('Error initializing the app:', error);
    }
})();