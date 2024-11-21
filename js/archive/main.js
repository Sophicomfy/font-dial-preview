// main.js

(async function initializeApp() {
    try {
        const { assetsBaseUrl, jsonUrl, defaultPresets } = Presets;

        // Fetch font data from the server
        const fontData = await Server.fetchFontData(jsonUrl);

        // Process all models data
        const allModelsData = DataProcessing.processAllModels(fontData);
        console.log('main allModelsData:', allModelsData);

        // Initial preview and download setup
        setupui(fontData, defaultPresets, assetsBaseUrl);

    } catch (error) {
        console.error('Error initializing the app:', error);
    }
})(); // Properly placed closing parenthesis for the IIFE

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