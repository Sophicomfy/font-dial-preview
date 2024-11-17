// preview-font.js
const PreviewFont = {
    async applyFontToPreview(woff2Url) {
        if (!woff2Url) {
            throw new Error('Invalid woff2Url provided.');
        }

        try {
            const fontFamily = this.extractFontFamilyFromUrl(woff2Url);

            // Use the FontFace API to load the font
            const font = new FontFace(fontFamily, `url(${woff2Url})`);
            await font.load();

            // Add the loaded font to the document
            document.fonts.add(font);
            console.log(`Font ${fontFamily} loaded and added to the document.`);

            // Apply the font to the preview element
            const previewElement = document.querySelector('.font-preview[data-lttrface-preview]');
            if (previewElement) {
                previewElement.style.fontFamily = fontFamily;
                console.log(`Font family ${fontFamily} applied to the preview element.`);
            } else {
                console.error('Preview element not found.');
            }
        } catch (error) {
            console.error('Failed to apply font to preview:', error);
        }
    },

    extractFontFamilyFromUrl(fontUrl) {
        const fontFileName = fontUrl.split('/').pop(); // Extract the file name from the URL
        const fontFamily = fontFileName.replace('.woff2', ''); // Remove the `.woff2` extension
        return `preview-${fontFamily}`; // Return a unique font-family name
    }
};