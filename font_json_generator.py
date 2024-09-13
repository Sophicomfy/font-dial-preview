import os
import json
import re

FONT_DIRECTORY = './web/ai_testing_samples'
FONT_PATTERN = re.compile(r'^(?P<fontName>[\w\-]+)-(?P<modelName>[\w\-]+)-(?P<epochs>\d+)-(?P<samples>\d+)-(?P<fontNumber>\d+)\.woff2$')
JSON_OUTPUT_PATH = os.path.join(FONT_DIRECTORY, 'fonts_data.json')

def generate_font_data_json(directory):
    font_data = {}

    if not os.path.exists(directory):
        os.makedirs(directory)

    for root, _, files in os.walk(directory):
        print(f"Processing files in {root}")  # Debugging line
        for file in files:
            if file.endswith('.woff2'):
                match = FONT_PATTERN.match(file)
                if not match:
                    print(f"Skipping file: {file} (doesn't match pattern)")  # Debugging line
                    continue
                
                font_info = match.groupdict()
                model_name = font_info['modelName']
                epochs = int(font_info['epochs'])
                samples = int(font_info['samples'])
                font_number = font_info['fontNumber']
                font_url = os.path.join(root, file).replace('\\\\', '/')

                if model_name not in font_data:
                    font_data[model_name] = {
                        'modelName': model_name,
                        'epochsRange': [],
                        'samplesRange': [],
                        'fontNumberRange': [],
                        'generatedFonts': {}
                    }

                model_data = font_data[model_name]

                if epochs not in model_data['epochsRange']:
                    model_data['epochsRange'].append(epochs)
                if samples not in model_data['samplesRange']:
                    model_data['samplesRange'].append(samples)
                if font_number not in model_data['fontNumberRange']:
                    model_data['fontNumberRange'].append(font_number)

                # Use a unique key for each font to avoid overwriting
                font_key = f"{font_number}-{epochs}-{samples}"
                model_data['generatedFonts'][font_key] = {
                    'modelName': model_name,
                    'epochs': epochs,
                    'samples': samples,
                    'fontNumber': font_number,
                    'fontUrl': font_url
                }

    for model in font_data.values():
        model['epochsRange'].sort()
        model['samplesRange'].sort()
        model['fontNumberRange'].sort()

    with open(JSON_OUTPUT_PATH, 'w') as json_file:
        json.dump({'model': font_data}, json_file, indent=4)

    print(f'JSON file generated and saved to {JSON_OUTPUT_PATH}')


# Call the function
generate_font_data_json(FONT_DIRECTORY)
