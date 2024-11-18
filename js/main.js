// `main.js`

(async function initializeApp() {
    try {
        const { assetsBaseUrl, jsonUrl, defaultPresets } = Presets;

        // Fetch font data from the server
        const fontData = await Server.fetchFontData(jsonUrl);

        // Set default presets
        const selectedModel = defaultPresets.model;
        const selectedEpoch = defaultPresets.epochs;
        const selectedSample = defaultPresets.samples;
        const selectedFontNumber = defaultPresets.fontNumber;

        // Populate all dropdowns using ui-make-html-elements.js
        UIMakeHtmlElements.populateAllDropdowns(
            fontData,
            selectedModel,
            selectedEpoch,
            selectedSample,
            selectedFontNumber
        );

        // Initialize dropdown interactions using ui-interactions.js
        UIDropdown.initializeDropdowns();

        // Handle font selection and preview
        const fontUrl = FontFinder.findFont(fontData, selectedModel, selectedEpoch, selectedSample, selectedFontNumber);

        // Generate full font URLs
        const fontUrls = GetFont.getFontUrls(fontUrl, assetsBaseUrl);

        // Apply the font to the preview area using the woff2 URL
        await PreviewFont.applyFontToPreview(fontUrls.woff2);

        // Set the download link for the font using the otf URL
        await DownloadFont.setFontDownloadButton(fontUrls.otf);
    } catch (error) {
        console.error('Error initializing the app:', error);
    }
})();