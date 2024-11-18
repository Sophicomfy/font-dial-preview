// `download-font.js`

const DownloadFont = {
    async setDownloadFontLink(otfUrl, downloadButton) {
        if (!otfUrl || !downloadButton) {
            throw new Error('Invalid otfUrl or downloadButton provided.');
        }

        try {
            // Example: Validate the URL by making a HEAD request to ensure it is accessible
            await this.validateUrl(otfUrl);

            downloadButton.href = otfUrl;
            const fileName = this.extractFileNameFromUrl(otfUrl);
            downloadButton.download = fileName;

            console.log(`Download link set for font: ${otfUrl}`);
        } catch (error) {
            console.error('Failed to set the download link:', error);
        }
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
    },

    extractFileNameFromUrl(url) {
        const parts = url.split('/');
        return parts[parts.length - 1]; // Return the last part of the URL (file name)
    },

    async setFontDownloadButton(otfUrl) {
        const downloadButton = document.querySelector('.button--lttrai--download-font');
        if (downloadButton) {
            await this.setDownloadFontLink(otfUrl, downloadButton);
        } else {
            console.error('Download button not found.');
        }
    }
};
