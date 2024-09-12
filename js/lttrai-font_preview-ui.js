document.addEventListener('DOMContentLoaded', async function() {
    // Fetch the data from the server-side script
    const fontData = await window.fetchFontData(); // Assumes fetchFontData is in lttrai-font_preview-server.js

    if (!fontData) {
        console.error('Font data could not be fetched.');
        return;
    }

    // Get available models from the font data
    const availableModels = window.getAvailableModels();
    
    // Initialize UI
    buildModelOptions(availableModels);

    // Build UI functions

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
        epochsContainer.innerHTML = '';  // Clear previous epoch options

        parameters.epochsRange.forEach(epoch => {
            const epochOption = createRadioButtonOption('epochs', epoch, epoch === parameters.epochsRange[0]);
            epochsContainer.appendChild(epochOption);
        });

        selectedEpoch = parameters.epochsRange[0];  // Preselect the first epoch
    }

    // Function to build the sample options UI based on the selected model
    function buildSampleOptions(parameters) {
        const samplesContainer = document.querySelector('.samples-selection');
        samplesContainer.innerHTML = '';  // Clear previous samples options

        parameters.samplesRange.forEach(sample => {
            const sampleOption = createRadioButtonOption('samples', sample, sample === parameters.samplesRange[0]);
            samplesContainer.appendChild(sampleOption);
        });

        selectedSample = parameters.samplesRange[0];  // Preselect the first sample
    }

    // Function to build the font number options UI based on the selected model
    function buildFontNumberOptions(parameters) {
        const fontContainer = document.querySelector('.font-selection');
        fontContainer.innerHTML = '';  // Clear previous font number options

        parameters.fontNumberRange.forEach(fontNumber => {
            const fontOption = createRadioButtonOption('font', fontNumber, fontNumber === parameters.fontNumberRange[0]);
            fontContainer.appendChild(fontOption);
        });

        selectedFontNumber = parameters.fontNumberRange[0];  // Preselect the first font number
    }

    // Event handler for when a model is changed
    function handleModelChange(selectedModel) {
        const parameters = window.getParametersForModel(selectedModel); // Assumes getParametersForModel is in lttrai-font_preview-server.js
        if (!parameters) {
            console.error('Parameters for the selected model could not be found.');
            return;
        }

        // Update UI with new options for epochs, samples, and font numbers
        buildEpochOptions(parameters);
        buildSampleOptions(parameters);
        buildFontNumberOptions(parameters);

        // Update the preview based on the initial combination
        updatePreview(selectedModel, selectedEpoch, selectedSample, selectedFontNumber);
    }

    // Helper function to create radio button UI components
    function createRadioButtonOption(name, value, isChecked) {
        const label = document.createElement('label');
        const input = document.createElement('input');
        const img = document.createElement('img');

        input.type = 'radio';
        input.name = name;
        input.value = value;
        input.checked = isChecked;
        input.addEventListener('change', function(event) {
            switch (name) {
                case 'model':
                    selectedModel = value;
                    handleModelChange(value);
                    break;
                case 'epochs':
                    selectedEpoch = value;
                    console.log('Epoch changed to:', selectedEpoch);
                    updatePreview(selectedModel, selectedEpoch, selectedSample, selectedFontNumber);
                    break;
                case 'samples':
                    selectedSample = value;
                    console.log('Samples changed to:', selectedSample);
                    updatePreview(selectedModel, selectedEpoch, selectedSample, selectedFontNumber);
                    break;
                case 'font':
                    selectedFontNumber = value;
                    console.log('Font No changed to:', selectedFontNumber);
                    updatePreview(selectedModel, selectedEpoch, selectedSample, selectedFontNumber);
                    break;
            }
        });

        // Example images (use actual paths for images)
        img.src = `path_to_image/${name}_${value}.jpg`; 
        img.alt = `${name} ${value}`;

        label.appendChild(input);
        label.appendChild(img);

        return label;
    }

    // Function to update the preview based on selected options
    function updatePreview(selectedModel, selectedEpoch, selectedSample, selectedFontNumber) {
        const fontUrl = window.constructFontUrl(selectedModel, selectedEpoch, selectedSample, selectedFontNumber);  // Assumes constructFontUrl is in lttrai-font_preview-display.js
        console.log('Font requested:', fontUrl);

        // Display the font (assumed that downloadAndDisplayFont is in lttrai-font_preview-display.js)
        window.downloadAndDisplayFont(fontUrl);
    }
});
