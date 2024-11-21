document.addEventListener('DOMContentLoaded', async function() {
    // Wait for the data to be fetched before proceeding with the UI build
    let fontData;
    try {
        fontData = await window.fetchFontData(); // Wait until the font data is fetched
        if (!fontData) {
            throw new Error('Font data could not be fetched.');
        }
    } catch (error) {
        console.error('Error fetching font data:', error);
        return;
    }

    // Get available models from the font data
    const availableModels = window.getAvailableModels();

    // Initialize UI with preselected values and set them as global properties
    window.selectedModel = availableModels[0];
    window.selectedEpoch = null;
    window.selectedSample = null;
    window.selectedFontNumber = null;

    // Build the initial model options
    buildModelOptions(availableModels);

    // Function to build the model options UI
    function buildModelOptions(models) {
        const fieldset = document.querySelector('.model-selection fieldset');
        fieldset.innerHTML = ''; // Clear only the fieldset, keeping h3 and p intact

        models.forEach(model => {
            const modelOption = createRadioButtonOption('model', model, model === models[0]);
            fieldset.appendChild(modelOption);
        });

        handleModelChange(models[0]); // Automatically trigger model change for the first model
    }

    // Function to build the epoch options UI based on the selected model
    function buildEpochOptions(parameters) {
        const fieldset = document.querySelector('.epochs-selection fieldset');
        fieldset.innerHTML = ''; // Clear only the fieldset, keeping h3 and p intact

        parameters.epochsRange.forEach(epoch => {
            const epochOption = createRadioButtonOption('epochs', epoch, epoch === parameters.epochsRange[0]);
            fieldset.appendChild(epochOption);
        });

        window.selectedEpoch = parameters.epochsRange[0]; // Set the first epoch as the default
    }

    // Function to build the sample options UI based on the selected model
    function buildSampleOptions(parameters) {
        const fieldset = document.querySelector('.samples-selection fieldset');
        fieldset.innerHTML = ''; // Clear only the fieldset, keeping h3 and p intact

        parameters.samplesRange.forEach(sample => {
            const sampleOption = createRadioButtonOption('samples', sample, sample === window.selectedSample || sample === parameters.samplesRange[0]);
            fieldset.appendChild(sampleOption);
        });

        window.selectedSample = window.selectedSample || parameters.samplesRange[0]; // Set the first sample as the default
    }

    // Function to build the font number options UI based on the selected model
    function buildFontNumberOptions(parameters) {
        const fieldset = document.querySelector('.font-selection fieldset');
        fieldset.innerHTML = ''; // Clear only the fieldset, keeping h3 and p intact

        parameters.fontNumberRange.forEach(fontNumber => {
            const fontOption = createRadioButtonOption('font', fontNumber, fontNumber === window.selectedFontNumber || fontNumber === parameters.fontNumberRange[0]);
            fieldset.appendChild(fontOption);
        });

        window.selectedFontNumber = window.selectedFontNumber || parameters.fontNumberRange[0]; // Set the first font number as the default
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

        // Trigger the preview update via the display script
        window.triggerPreviewUpdate(window.selectedModel, window.selectedEpoch, window.selectedSample, window.selectedFontNumber); 
    }

    // Helper function to create radio button UI components styled as CSS classes and content values
    function createRadioButtonOption(name, value, isChecked) {
        const label = document.createElement('label');
        const input = document.createElement('input');
        const span = document.createElement('span');

        input.type = 'radio';
        input.name = name;
        input.value = value;
        input.checked = isChecked;
        input.addEventListener('change', function(event) {
            switch (name) {
                case 'model':
                    window.selectedModel = value;
                    handleModelChange(value);
                    break;
                case 'epochs':
                    window.selectedEpoch = value;
                    console.log('Epoch changed to:', window.selectedEpoch);
                    window.triggerPreviewUpdate(window.selectedModel, window.selectedEpoch, window.selectedSample, window.selectedFontNumber); 
                    break;
                case 'samples':
                    window.selectedSample = value;
                    console.log('Samples changed to:', window.selectedSample);
                    window.triggerPreviewUpdate(window.selectedModel, window.selectedEpoch, window.selectedSample, window.selectedFontNumber); 
                    break;
                case 'font':
                    window.selectedFontNumber = value;
                    console.log('Font No changed to:', window.selectedFontNumber);
                    window.triggerPreviewUpdate(window.selectedModel, window.selectedEpoch, window.selectedSample, window.selectedFontNumber); 
                    break;
            }
        });

        // Set the span's content and CSS class based on the option value
        span.classList.add(`${name}-option`);
        span.textContent = value; // Represent the value as text content inside the span

        label.appendChild(input);
        label.appendChild(span);

        return label;
    }
});