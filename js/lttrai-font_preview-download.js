// Ensure the script runs only after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the download button using its class
    const downloadButton = document.querySelector('.button--lttrai--download-font');

    // Event listener for the download button
    downloadButton.addEventListener('click', function() {
        // Check if global variables are available and valid
        const selectedModel = window.selectedModel;
        const selectedEpoch = window.selectedEpoch;
        const selectedSample = window.selectedSample;
        const selectedFontNumber = window.selectedFontNumber;

        if (selectedModel && selectedEpoch && selectedSample && selectedFontNumber) {
            downloadFont(selectedModel, selectedEpoch, selectedSample, selectedFontNumber);
        } else {
            console.error('Default font parameters are missing. Ensure the UI script has set them correctly.');
            alert('The default font cannot be downloaded. Please select a font configuration first.');
        }
    });
    
    // Function to initiate font download
    function downloadFont(model, epoch, sample, fontNumber) {
        // Construct the URL for the default font file, assuming .woff format for now
        const fontUrl = `https://assets.lttrcorp.com/2024-10-01-ai-font-tester/ai_testing_samples/${model}-${epoch}-${sample}-${fontNumber}.woff2`;

        fetch(fontUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Font file not found');
                }
                return response.blob();
            })
            .then(blob => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `${model}-${epoch}-${sample}-${fontNumber}.woff2`;
                link.click();
                URL.revokeObjectURL(link.href);
            })
            .catch(error => {
                console.error('Error downloading font file:', error);
                alert('The selected font file could not be downloaded.');
            });
    }
});
