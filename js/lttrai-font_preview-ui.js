document.addEventListener('DOMContentLoaded', async function() {
    // Wait for the data to be fetched before proceeding with the UI build
    let fontData;
    try {
        fontData = await window.fetchFontData(); // Wait until the font data is fetched
        if (!fontData) {
            throw new Error('Font data could not be fetched.');
        }
        console.log('Fetched `fontData` are ready for UI to be builded'); // Log when data is fetched
    } catch (error) {
        console.error('Error fetching font data:', error);
        return;
    }

    // Get available models from the font data
    const availableModels = window.getAvailableModels();

    // Initialize UI with preselected values
    let selectedModel = availableModels[0];
    let selectedEpoch = null;
    let selectedSample = null;
    let selectedFontNumber = null;

    // Log initial selections
    console.log('Initial model selected:', selectedModel);

    // Build the initial model options
    buildModelOptions(availableModels);

    // Function to build the model options UI
    function buildModelOptions(models) {
        const modelContainer = document.querySelector('.model-selection');
        modelContainer.innerHTML = ''; // Clear previous model options

        models.forEach(model => {
            const modelOption = createRadioButtonOption('model', model, model === models[0]);
            modelContainer.appendChild(modelOption);
        });

        // Automatically trigger model change to initialize epochs, samples, and fonts for the first model
        handleModelChange(models[0]);
    }

    // Function to build the epoch options UI based on the selected model
    function buildEpochOptions(parameters) {
        const epochsContainer = document.querySelector('.epochs-selection');
        epochsContainer.innerHTML = ''; // Clear previous epoch options

        parameters.epochsRange.forEach(epoch => {
            const epochOption = createRadioButtonOption('epochs', epoch, epoch === parameters.epochsRange[0]);
            epochsContainer.appendChild(epochOption);
        });

        selectedEpoch = parameters.epochsRange[0]; // Preselect the first epoch
        console.log('Initial epoch selected:', selectedEpoch); // Log selected epoch
    }

    // Function to build the sample options UI based on the selected model
    function buildSampleOptions(parameters) {
        const samplesContainer = document.querySelector('.samples-selection');
        samplesContainer.innerHTML = ''; // Clear previous samples options

        parameters.samplesRange.forEach(sample => {
            const sampleOption = createRadioButtonOption('samples', sample, sample === selectedSample || sample === parameters.samplesRange[0]);
            samplesContainer.appendChild(sampleOption);
        });

        selectedSample = selectedSample || parameters.samplesRange[0]; // Preselect the first sample
        console.log('Initial sample selected:', selectedSample); // Log selected sample
    }

    // Function to build the font number options UI based on the selected model
    function buildFontNumberOptions(parameters) {
        const fontContainer = document.querySelector('.font-selection');
        fontContainer.innerHTML = ''; // Clear previous font number options

        parameters.fontNumberRange.forEach(fontNumber => {
            const fontOption = createRadioButtonOption('font', fontNumber, fontNumber === selectedFontNumber || fontNumber === parameters.fontNumberRange[0]);
            fontContainer.appendChild(fontOption);
        });

        selectedFontNumber = selectedFontNumber || parameters.fontNumberRange[0]; // Preselect the first font number
        console.log('Initial font number selected:', selectedFontNumber); // Log selected font number
    }

    // Event handler for when a model is changed
    function handleModelChange(selectedModel) {
        const parameters = window.getParametersForModel(selectedModel); // Assumes getParametersForModel is in lttrai-font_preview-server.js
        if (!parameters) {
            console.error('Parameters for the selected model could not be found.');
            return;
        }

        // Log the selected model
        console.log('Model changed to:', selectedModel);

        // Update UI with new options for epochs, samples, and font numbers
        buildEpochOptions(parameters);
        buildSampleOptions(parameters);
        buildFontNumberOptions(parameters);

        // Trigger the preview update by notifying the display script
        triggerPreviewUpdate(selectedModel, selectedEpoch, selectedSample, selectedFontNumber);
    }

    // Function to trigger the preview update via the display script
    function triggerPreviewUpdate(selectedModel, selectedEpoch, selectedSample, selectedFontNumber) {
        // Log the selected values before updating the preview
        console.log('Triggering preview update with:');
        console.log('Model:', selectedModel);
        console.log('Epoch:', selectedEpoch);
        console.log('Sample:', selectedSample);
        console.log('Font Number:', selectedFontNumber);

        const fontUrl = window.findFont(selectedModel, selectedEpoch, selectedSample, selectedFontNumber); // Assumes findFont is in lttrai-font_preview-server.js
        if (fontUrl) {
            console.log('Font URL retrieved from JSON:', fontUrl); // Log the retrieved font URL
            // Pass the fontUrl to the display script
            window.downloadAndDisplayFont(fontUrl); // Assumes downloadAndDisplayFont is in lttrai-font_preview-display.js
        } else {
            console.error('Font URL could not be found for the selected combination.');
        }
    }
});