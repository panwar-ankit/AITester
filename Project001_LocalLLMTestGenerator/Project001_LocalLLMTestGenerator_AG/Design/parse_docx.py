import zipfile
import re
import sys
import os

def read_docx(file_path):
    if not os.path.exists(file_path):
        return f"File not found: {file_path}"
    try:
        with zipfile.ZipFile(file_path) as docx:
            xml_content = docx.read('word/document.xml').decode('utf-8')
            texts = re.findall(r'<w:t(?:[^>]*)>(.*?)</w:t>', xml_content)
            return '\n'.join(texts)
    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == '__main__':
    print(read_docx(sys.argv[1]))
