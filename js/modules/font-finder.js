// font-finder.js
const FontFinder = {
    findFont(fontData, selectedModel, selectedEpoch, selectedSample, selectedFontNumber) {
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
    }
};