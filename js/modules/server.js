// server.js
const Server = {
    async fetchFontData() {
        const jsonUrl = 'https://assets.lttrcorp.com/2024-10-01-ai-font-tester/ai_testing_samples/fonts_data.json';
        try {
            const response = await fetch(jsonUrl);
            const fontData = await response.json();
            console.log('Font data fetched:', fontData);
            return fontData;
        } catch (error) {
            console.error('Error fetching font data:', error);
            throw error;
        }
    }
};