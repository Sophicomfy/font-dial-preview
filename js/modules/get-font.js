    // get-font.js namespace for the example
    const GetFont = {
        async downloadFonts(fontUrl) {
            const assetsBaseUrl = 'https://assets.lttrcorp.com/';
            try {
                // Update font URLs
                const woff2Url = fontUrl.replace('./web/', assetsBaseUrl);
                const otfUrl = woff2Url.replace('.woff2', '.otf');

                // Download both fonts
                await Promise.all([downloadFontFile(woff2Url, 'woff2'), downloadFontFile(otfUrl, 'otf')]);
            } catch (error) {
                console.error('Error downloading fonts:', error);
            }
        }
    };

    async function downloadFontFile(url, format) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to download font: ${url}`);
            }
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${getFileNameFromUrl(url)}.${format}`;
            link.click();
            URL.revokeObjectURL(link.href);
            console.log(`Font downloaded: ${url}`);
        } catch (error) {
            console.error(`Error downloading ${format} font from ${url}:`, error);
        }
    }

    function getFileNameFromUrl(url) {
        const parts = url.split('/');
        const fileName = parts[parts.length - 1];
        return fileName.replace(/\.[^/.]+$/, ''); // Remove the file extension
    }