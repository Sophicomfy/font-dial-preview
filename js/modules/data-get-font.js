// data-get-font.js

const GetFont = {
    getFontUrls(fontUrl, baseUrl) {
        if (!fontUrl || !baseUrl) {
            throw new Error('Invalid fontUrl or baseUrl provided.');
        }

        // Replace './web/' with the base URL
        const woff2Url = fontUrl.replace('./web/', baseUrl);

        // Replace 'woff2' with 'otf' for the second format
        const otfUrl = woff2Url.replace('.woff2', '.otf');

        // Return the URLs as an object
        return {
            woff2: woff2Url,
            otf: otfUrl
        };
    }
};