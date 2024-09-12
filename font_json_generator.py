import os
import json
import re

# Function to parse font filename and extract modelName, epochs, samples, and fontNumber
def parse_font_filename(filename):
    # Example pattern: NewFont-{modelName}-{epochs}-{samples}-{fontNumber}.woff2
    pattern = re.compile(r'(?P<fontName>[^-]+)-(?P<modelName>[^-]+)-(?P<epochs>\d+)-(?P<samples>\d+)-(?P<fontNumber>\d+)\.woff2')

    match = pattern.match(filename)
    if match:
        return match.groupdict()
    return None

# Function to search for all woff2 files recursively and generate JSON structure
def generate_json(directory):
    fonts_data = {}

    # Traverse the directory to find all .woff2 files
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".woff2"):
                parsed_data = parse_font_filename(file)
                if parsed_data:
                    # Extract values from parsed font file
                    modelName = parsed_data['modelName']
                    epochs = int(parsed_data['epochs'])
                    samples = int(parsed_data['samples'])
                    fontNumber = int(parsed_data['fontNumber'])
                    font_url = os.path.join(root, file).replace('\\', '/')

                    # Initialize model if it doesn't exist
                    if modelName not in fonts_data:
                        fonts_data[modelName] = {
                            "parameters": {
                                "modelName": modelName,
                                "epochsRange": [],
                                "samplesRange": [],
                                "fontNumberRange": []
                            },
                            "generatedFonts": []
                        }

                    model_data = fonts_data[modelName]

                    # Update parameters (add unique values to the ranges)
                    if epochs not in model_data["parameters"]["epochsRange"]:
                        model_data["parameters"]["epochsRange"].append(epochs)
                    if samples not in model_data["parameters"]["samplesRange"]:
                        model_data["parameters"]["samplesRange"].append(samples)
                    if fontNumber not in model_data["parameters"]["fontNumberRange"]:
                        model_data["parameters"]["fontNumberRange"].append(fontNumber)

                    # Add the font URL to the generatedFonts
                    model_data["generatedFonts"].append({
                        "fontUrl": font_url
                    })

    # Sort the ranges in ascending order
    for modelName, model_data in fonts_data.items():
        model_data["parameters"]["epochsRange"].sort()
        model_data["parameters"]["samplesRange"].sort()
        model_data["parameters"]["fontNumberRange"].sort()

    # Save the JSON file in the same directory as the font files
    output_json = os.path.join(directory, 'fonts_data.json')
    with open(output_json, 'w') as json_file:
        json.dump({"model": fonts_data}, json_file, indent=4)

    print(f"JSON file generated: {output_json}")

# Example usage
if __name__ == "__main__":
    directory = "./web/ai_testing_samples"  # Update with the directory containing font files
    generate_json(directory)
