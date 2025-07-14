from flask import Flask, request, jsonify
from flask_cors import CORS
import ollama

app = Flask(__name__)
CORS(app)

@app.route('/generate', methods=['POST'])
def generate_response():
    try:
        prompt = request.json.get('prompt', '')
        
        if not prompt:
            return jsonify({'error': 'No prompt provided'}), 400

        # Use the official Ollama client
        response = ollama.generate(
            model='gemma',
            prompt=prompt,
            stream=False
        )

        return jsonify({'response': response['response']})
        
    except ollama.ResponseError as e:
        return jsonify({'error': f'Ollama error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

if __name__ == "__main__":
    app.run(debug=True)