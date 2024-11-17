const assetsBaseUrl = 'https://assets.lttrcorp.com/';

(async function initializeApp() {
    try {
        // Fetch font data from the server
        const fontData = await Server.fetchFontData();

        // Get available models
        const availableModels = DataProcessing.getAvailableModels(fontData);
        console.log('Available Models:', availableModels);

        // Select the first model by default
        const selectedModel = availableModels[0];
        const parameters = DataProcessing.getParametersForModel(fontData, selectedModel);

        console.log('Parameters for Selected Model:', parameters);

        // Populate dropdowns using the ui-make-html-elements.js module
        UIMakeHtmlElements.populateDropdown('.model-selection .dropdown', availableModels, selectedModel);
        UIMakeHtmlElements.populateDropdown('.epochs-selection .dropdown', parameters.epochsRange, parameters.epochsRange[0]);
        UIMakeHtmlElements.populateDropdown('.samples-selection .dropdown', parameters.samplesRange, parameters.samplesRange[0]);
        UIMakeHtmlElements.populateDropdown('.font-selection .dropdown', parameters.fontNumberRange, parameters.fontNumberRange[0]);

        // Initialize dropdown interactions
        UIDropdown.initializeDropdowns();

        // Example: Find a specific font
        const fontUrl = FontFinder.findFont(fontData, selectedModel, parameters.epochsRange[0], parameters.samplesRange[0], parameters.fontNumberRange[0]);
        if (fontUrl) {
            console.log('Found Font URL:', fontUrl);

            // Get font URLs
            const fontUrls = GetFont.getFontUrls(fontUrl, assetsBaseUrl);
            console.log('Generated Font URLs:', fontUrls);

            // Apply the font to the preview area using the woff2 URL
            await PreviewFont.applyFontToPreview(fontUrls.woff2);

            // Set the download link for the font using the otf URL
            const downloadButton = document.querySelector('.button--lttrai--download-font');
            if (downloadButton) {
                DownloadFont.setDownloadFontLink(fontUrls.otf, downloadButton);
            } else {
                console.error('Download button not found.');
            }
        }
    } catch (error) {
        console.error('Error initializing the app:', error);
    }
})();