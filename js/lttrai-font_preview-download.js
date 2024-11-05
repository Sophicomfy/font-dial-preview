// Declare variables to store user selections
let selectedModel = null;
let selectedEpoch = null;
let selectedSample = null;
let selectedFontNumber = null;

// Function to download the selected font as a .otf file
function downloadOtfFont() {
    if (!selectedModel || !selectedEpoch || !selectedSample || !selectedFontNumber) {
        console.error('One or more font parameters are not defined.');
        alert('Please select all font parameters before downloading.');
        return;
    }

    const otfFileUrl = `https://assets.lttrcorp.com/2024-10-01-ai-font-tester/ai_testing_samples/${selectedModel}-${selectedEpoch}-${selectedSample}-${selectedFontNumber}.otf`;

    fetch(otfFileUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('OTF file not found');
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
            console.error('Error downloading .otf file:', error);
            alert('The selected .otf file is not available.');
        });
}

// Add event listener to the button with class `.button--lttrai--download-font`
document.addEventListener('DOMContentLoaded', () => {
    const downloadButton = document.querySelector('.button--lttrai--download-font');
    
    if (downloadButton) {
        downloadButton.addEventListener('click', downloadOtfFont);
    } else {
        console.error('Download button not found in the DOM.');
    }
});

// Assume these values are updated elsewhere in the code, such as in the UI selection handlers.
function updateFontSelection(model, epoch, sample, fontNumber) {
    selectedModel = model;
    selectedEpoch = epoch;
    selectedSample = sample;
    selectedFontNumber = fontNumber;
}
