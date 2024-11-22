// ui-font-management.js

const FontManagement = {
    findFont(uiState, fontData) {
        const { selectedModel, selectedEpoch, selectedSample, selectedFontNumber } = uiState.selectedOptions;

        if (!fontData || !fontData.model[selectedModel]) {
            console.error(`Model "${selectedModel}" not found in the font data.`);
            return null;
        }

        const fonts = fontData.model[selectedModel].generatedFonts;

        console.log('Searching for font with parameters:', {
            model: selectedModel,
            epoch: selectedEpoch,
            sample: selectedSample,
            fontNumber: selectedFontNumber
        });

        const font = Object.values(fonts).find(font =>
            font.epochs === selectedEpoch &&
            font.samples === selectedSample &&
            font.fontNumber === selectedFontNumber
        );

        if (font && font.fontUrl) {
            console.log('Matching font found:', font.fontUrl);
            return font.fontUrl;
        } else {
            console.error('Matching font not found in the font data.');
            return null;
        }
    },

    generateFontUrls(fontUrl, baseUrl) {
        if (!fontUrl || !baseUrl) {
            throw new Error('Invalid fontUrl or baseUrl provided.');
        }

        const woff2Url = fontUrl.replace('./web/', baseUrl);
        const otfUrl = woff2Url.replace('.woff2', '.otf');

        console.log('Font URLs generated:', { woff2: woff2Url, otf: otfUrl });

        return { woff2: woff2Url, otf: otfUrl };
    },

    async applyFontToPreview(woff2Url) {
        if (!woff2Url) {
            throw new Error('Invalid woff2Url provided.');
        }

        try {
            const fontFamily = this.extractFontFamilyFromUrl(woff2Url);

            const font = new FontFace(fontFamily, `url(${woff2Url})`);
            await font.load();
            document.fonts.add(font);

            console.log(`Font ${fontFamily} loaded and added to the document.`);

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
        const fontFileName = fontUrl.split('/').pop();
        const fontFamily = fontFileName.replace('.woff2', '');
        return `preview-${fontFamily}`;
    },

    async configureDownloadButton(otfUrl) {
        const downloadButton = document.querySelector('.button--lttrai--download-font');
        if (!otfUrl || !downloadButton) {
            console.error('Invalid otfUrl or download button not found.');
            return;
        }

        try {
            await this.validateUrl(otfUrl);

            downloadButton.href = otfUrl;
            const fileName = this.extractFileNameFromUrl(otfUrl);
            downloadButton.download = fileName;

            console.log(`Download button configured with font: ${otfUrl}`);
        } catch (error) {
            console.error('Failed to configure the download button:', error);
        }
    },

    extractFileNameFromUrl(url) {
        return url.split('/').pop();
    },

    async validateUrl(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            if (!response.ok) {
                throw new Error(`URL validation failed with status ${response.status}`);
            }
        } catch (error) {
            throw new Error(`Unable to validate URL: ${url}. ${error.message}`);
        }
    }
};