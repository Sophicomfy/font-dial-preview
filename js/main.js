// `main.js`

(async function initializeApp() {
    try {
        const { assetsBaseUrl, jsonUrl, defaultPresets } = Presets;

        // Fetch font data from the server
        const fontData = await Server.fetchFontData(jsonUrl);

        // Initialize dropdowns with default presets
        const selectedPresets = { ...defaultPresets };
        UIMakeHtmlElements.initializeDropdowns(fontData, selectedPresets);

        // Attach dropdown listeners with re-attachment after updates
        const dropdownSelectors = ['.model-selection', '.epochs-selection', '.samples-selection', '.font-selection'];

        dropdownSelectors.forEach(selector => {
            UIInteractions.attachDropdownListeners(selector, fontData, selectedPresets, (newSelectedOption, dropdownType) => {
                // Update the UI based on the new selection
                UIMakeHtmlElements.handleNewSelection(fontData, selectedPresets, newSelectedOption, dropdownType);

                // Re-apply font preview and download setup after UI update
                setupFontPreviewAndDownload(fontData, selectedPresets, assetsBaseUrl);
            });
        });

        // Initial preview and download setup
        setupFontPreviewAndDownload(fontData, selectedPresets, assetsBaseUrl);

    } catch (error) {
        console.error('Error initializing the app:', error);
    }
})();

async function setupFontPreviewAndDownload(fontData, selectedPresets, assetsBaseUrl) {
    try {
        // Handle font selection and preview
        const fontUrl = FontFinder.findFont(
            fontData,
            selectedPresets.model,
            selectedPresets.epochs,
            selectedPresets.samples,
            selectedPresets.fontNumber
        );

        // Generate full font URLs
        const fontUrls = GetFont.getFontUrls(fontUrl, assetsBaseUrl);

        // Apply the font to the preview area using the woff2 URL
        await PreviewFont.applyFontToPreview(fontUrls.woff2);

        // Set the download link for the font using the otf URL
        await DownloadFont.setFontDownloadButton(fontUrls.otf);

    } catch (error) {
        console.error('Error setting up font preview and download:', error);
    }
}