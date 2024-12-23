// server-fetch-json.js
const lttraiAppServer = {
    async fetchFontData(url) {
        if (!url) {
            throw new Error('A valid JSON URL must be provided.');
        }
        try {
            const response = await fetch(url);
            const fontData = await response.json();
            console.log('server-fetch-json fontData:', fontData);
            return fontData;
        } catch (error) {
            console.error('Error fetching font data:', error);
            throw error;
        }
    }
};