// download-font.js
const DownloadFont = {
    setDownloadFontLink(otfUrl, downloadButton) {
        if (!otfUrl || !downloadButton) {
            throw new Error('Invalid otfUrl or downloadButton provided.');
        }

        try {
            // Set the href attribute to the otfUrl
            downloadButton.href = otfUrl;

            // Set the download attribute to suggest a filename
            const fileName = this.extractFileNameFromUrl(otfUrl);
            downloadButton.download = fileName;

            console.log(`Download link set for font: ${otfUrl}`);
        } catch (error) {
            console.error('Failed to set the download link:', error);
        }
    },

    extractFileNameFromUrl(url) {
        const parts = url.split('/');
        return parts[parts.length - 1]; // Return the last part of the URL (file name)
    }
};