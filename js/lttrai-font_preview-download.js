// Define global variables to hold selected options
let selectedModel = null;
let selectedEpoch = null;
let selectedSample = null;
let selectedFontNumber = null;

// Function to download the font as a .otf file
function downloadOtfFont(model, epoch, sample, fontNumber) {
    const otfFileUrl = `https://assets.lttrcorp.com/2024-10-01-ai-font-tester/ai_testing_samples/${model}-${epoch}-${sample}-${fontNumber}.otf`;

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
            link.download = `${model}-${epoch}-${sample}-${fontNumber}.otf`;
            link.click();
            URL.revokeObjectURL(link.href);
        })
        .catch(error => {
            console.error('Error downloading .otf file:', error);
            alert('The selected .otf file is not available.');
        });
}

// Event listener setup for the download button
document.addEventListener('DOMContentLoaded', function() {
    const downloadButton = document.querySelector('.button--lttrai--download-font');
    
    // Update the selected variables to the default state or preselected values
    selectedModel = selectedModel || 'defaultModel';  // Replace 'defaultModel' with the actual default model name
    selectedEpoch = selectedEpoch || 'defaultEpoch';  // Replace 'defaultEpoch' with the actual default epoch
    selectedSample = selectedSample || 'defaultSample';  // Replace 'defaultSample' with the actual default sample
    selectedFontNumber = selectedFontNumber || 'defaultFontNumber';  // Replace 'defaultFontNumber' with the actual default font number

    // Attach event listener to the download button
    downloadButton.addEventListener('click', function() {
        downloadOtfFont(selectedModel, selectedEpoch, selectedSample, selectedFontNumber);
    });
});