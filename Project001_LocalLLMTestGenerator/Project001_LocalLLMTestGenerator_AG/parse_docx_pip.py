import sys
import subprocess
import os

def install_and_read(file_path):
    try:
        import docx
    except ImportError:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "python-docx"])
        import docx

    if not os.path.exists(file_path):
        return f"File does not exist: {file_path}"
    
    try:
        doc = docx.Document(file_path)
        full_text = []
        for para in doc.paragraphs:
            if para.text.strip():
                full_text.append(para.text)
        return '\n'.join(full_text)
    except Exception as e:
        return f"Error reading document: {e}"

if __name__ == "__main__":
    print(install_and_read(sys.argv[1]))
