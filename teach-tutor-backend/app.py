# from flask import Flask
# from routes.generate import generate_bp

# app = Flask(__name__)
# app.register_blueprint(generate_bp)

# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import ollama

OLLAMA_API_URL = "http://localhost:11434/api/generate"

app = Flask(__name__)
CORS(app)

@app.route('/generate', methods=['POST'])
def generate_response():
    prompt = request.json.get('prompt', '')

    response = requests.post(OLLAMA_API_URL, json={
        "model": "gemma",
        "prompt": prompt,
        "stream": False
    })

    if response.status_code == 200:
        content = response.json().get('response', '')
        return jsonify({'response': content})
    else:
        return jsonify({'error': 'Failed to generate response'}), 500

if __name__ == "__main__":
    app.run(debug=True)