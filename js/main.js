(async function initializeApp() {
    try {
        const { assetsBaseUrl, jsonUrl, defaultPresets } = Presets;

        // Fetch font data from the server
        const fontData = await Server.fetchFontData(jsonUrl);

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
}
