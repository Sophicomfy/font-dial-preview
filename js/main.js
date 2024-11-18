// `main.js`

(async function initializeApp() {
    try {
        const { assetsBaseUrl, jsonUrl, defaultPresets } = Presets;

        // Fetch font data from the server
        const fontData = await Server.fetchFontData(jsonUrl);
        console.log('Font Data Fetched:', fontData);

        // Process all models to extract available data
        const allModelsData = DataProcessing.processAllModels(fontData);
        console.log('All Models Data:', allModelsData);

        // Use the default presets if they exist in the data
        const selectedModel = defaultPresets.model in allModelsData ? defaultPresets.model : Object.keys(allModelsData)[0];
        const modelData = allModelsData[selectedModel];
        
        if (!modelData) {
            console.error('No valid data available for the default or selected model.');
            return;
        }

        const selectedEpoch = modelData.availableEpochs.includes(defaultPresets.epochs) 
            ? defaultPresets.epochs 
            : modelData.availableEpochs[0];

        const selectedSample = modelData.availableSamples.includes(defaultPresets.samples) 
            ? defaultPresets.samples 
            : modelData.availableSamples[0];

        const selectedFontNumber = modelData.availableFontNumbers.includes(defaultPresets.fontNumber) 
            ? defaultPresets.fontNumber 
            : modelData.availableFontNumbers[0];

        console.log('Selected Presets:', { selectedModel, selectedEpoch, selectedSample, selectedFontNumber });

        // Populate dropdowns using the extracted data
        UIMakeHtmlElements.populateDropdown('.model-selection .dropdown', Object.keys(allModelsData), selectedModel);
        UIMakeHtmlElements.populateDropdown('.epochs-selection .dropdown', modelData.availableEpochs, selectedEpoch);
        UIMakeHtmlElements.populateDropdown('.samples-selection .dropdown', modelData.availableSamples, selectedSample);
        UIMakeHtmlElements.populateDropdown('.font-selection .dropdown', modelData.availableFontNumbers, selectedFontNumber);

        // Initialize dropdown interactions
        UIDropdown.initializeDropdowns();

        // Find and display a font based on the selected parameters
        const fontUrl = FontFinder.findFont(fontData, selectedModel, selectedEpoch, selectedSample, selectedFontNumber);

        if (fontUrl) {
            console.log('Font URL Found:', fontUrl);

            // Generate full font URLs
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
        } else {
            console.error('No matching font URL found.');
        }
    } catch (error) {
        console.error('Error initializing the app:', error);
    }
})();