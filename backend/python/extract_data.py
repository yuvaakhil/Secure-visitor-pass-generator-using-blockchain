import sys
import json
import pytesseract
from PIL import Image
import re
import os

# SET PATH TO TESSERACT (Windows only)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def extract_fields(text: str):
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    flat_text = " ".join(lines)

    name = ""
    dob = ""
    aadhaar = ""

    # Aadhaar number - either full 12-digit or masked
    aadhaar_match = re.search(r'(?:\d{4}\s\d{4}\s\d{4}|x{4,}\s*x{4,}\s*\d{4})', flat_text, re.IGNORECASE)
    if aadhaar_match:
        aadhaar = aadhaar_match.group(0).replace(' ', '')

    # DOB - DD/MM/YYYY or YYYY-MM-DD or similar
    dob_match = re.search(r'\b(?:DOB|D0B)?[:\s-]*((?:\d{2}[\/\-]\d{2}[\/\-]\d{4})|(?:\d{4}[-/]\d{2}[-/]\d{2}))\b', flat_text, re.IGNORECASE)
    if dob_match:
        dob = dob_match.group(1)

    # Name extraction logic
    name_line = ""
    for i, line in enumerate(lines):
        if re.match(r'^[A-Z][a-z]+(?: [A-Z][a-z]+)+$', line):  # Proper capitalized full name
            name_line = line
            break
        elif re.match(r'^[A-Z ]{6,}$', line) and not any(word in line.upper() for word in ['DOB', 'MALE', 'FEMALE', 'GOVERNMENT', 'AUTHORITY']):
            name_line = line
            break

    if not name_line:
        # Fallback: take the first line before DOB
        for i, line in enumerate(lines):
            if 'DOB' in line or re.search(r'\d{2}[/-]\d{2}[/-]\d{4}', line):
                if i > 0:
                    name_line = lines[i-1]
                    break

    if name_line:
        name = name_line.strip()

    return {
        "name": name or "Not found",
        "dob": dob or "Not found",
        "aadhaarNumber": aadhaar or "Not found"
    }

def main(image_path: str):
    try:
        image = Image.open(image_path)
        custom_config = r'--oem 3 --psm 6'
        text = pytesseract.image_to_string(image, lang='eng', config=custom_config)

        # Optional debug save
        with open("ocr_debug_output.txt", "w", encoding='utf-8') as f:
            f.write(text)

        result = extract_fields(text)
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image path provided"}))
    else:
        main(sys.argv[1])
