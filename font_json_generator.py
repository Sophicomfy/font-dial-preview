import os
import json
import re

# Directory where the font files are located
FONT_DIRECTORY = './web/ai_testing_samples'

# Regex pattern to match the naming convention {fontName}-{modelName}-{epochs}-{samples}-{fontNumber}.woff2
FONT_PATTERN = re.compile(r'^(?P<fontName>[\w\-]+)-(?P<modelName>[\w\-]+)-(?P<epochs>\d+)-(?P<samples>\d+)-(?P<fontNumber>\d+)\.woff2$')

# JSON output file path
JSON_OUTPUT_PATH = os.path.join(FONT_DIRECTORY, 'fonts_data-02.json')


def generate_font_data_json(directory):
    font_data = {}

    # Ensure the directory exists for saving the JSON file
    if not os.path.exists(directory):
        os.makedirs(directory)

    # Traverse the directory recursively
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.woff2'):
                match = FONT_PATTERN.match(file)
                if match:
                    font_info = match.groupdict()

                    # Extract the font attributes from the matched file name
                    model_name = font_info['modelName']
                    epochs = int(font_info['epochs'])
                    samples = int(font_info['samples'])
                    font_number = font_info['fontNumber']
                    font_url = os.path.join(root, file).replace('\\', '/')

                    # Ensure the structure for the model exists
                    if model_name not in font_data:
                        font_data[model_name] = {
                            'modelName': model_name,
                            'epochsRange': [],
                            'samplesRange': [],
                            'fontNumberRange': [],
                            'generatedFonts': {}
                        }

                    model_data = font_data[model_name]

                    # Populate ranges
                    if epochs not in model_data['epochsRange']:
                        model_data['epochsRange'].append(epochs)
                    if samples not in model_data['samplesRange']:
                        model_data['samplesRange'].append(samples)
                    if font_number not in model_data['fontNumberRange']:
                        model_data['fontNumberRange'].append(font_number)

                    # Add font details to generatedFonts
                    model_data['generatedFonts'][font_number] = {
                        'modelName': model_name,
                        'epochs': epochs,
                        'samples': samples,
                        'fontNumber': font_number,
                        'fontUrl': font_url
                    }

    # Ensure ranges are sorted
    for model in font_data.values():
        model['epochsRange'].sort()
        model['samplesRange'].sort()
        model['fontNumberRange'].sort()

    # Save the JSON file
    with open(JSON_OUTPUT_PATH, 'w') as json_file:
        json.dump({'model': font_data}, json_file, indent=4)

    print(f'JSON file generated and saved to {JSON_OUTPUT_PATH}')


# Call the function to generate the JSON
generate_font_data_json(FONT_DIRECTORY)
