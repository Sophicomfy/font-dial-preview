// Function to download the selected or default font
function downloadDefaultFont() {
    // Check if default values are available globally
    const selectedModel = window.selectedModel || 'defaultModel';
    const selectedEpoch = window.selectedEpoch || 'defaultEpoch';
    const selectedSample = window.selectedSample || 'defaultSample';
    const selectedFontNumber = window.selectedFontNumber || 'defaultFontNumber';

    // Construct the .otf file URL based on the selected/default values
    const otfFileUrl = `https://assets.lttrcorp.com/2024-10-01-ai-font-tester/ai_testing_samples/${selectedModel}-${selectedEpoch}-${selectedSample}-${selectedFontNumber}.otf`;

    // Fetch and download the .otf file
    fetch(otfFileUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Default OTF file not found');
            }
            return response.blob();
        })
        .then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${selectedModel}-${selectedEpoch}-${selectedSample}-${selectedFontNumber}.otf`;
            link.click();
            URL.revokeObjectURL(link.href);
        })
        .catch(error => {
            console.error('Error downloading default .otf file:', error);
            alert('The default .otf file is not available.');
        });
}