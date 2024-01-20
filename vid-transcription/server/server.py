import os
from flask import Flask, request
import requests
import modal

app = Flask(__name__)

@app.route('/transcribe', methods=["GET", "POST"])
def transcript():
    link = request.args.get("link")

    if not link:
        return "Link parameter is missing", 400

    # Download audio file from the link
    try:
        response = requests.get(link)
        response.raise_for_status()  # Raise an exception for bad responses
    except requests.exceptions.RequestException as e:
        return f"Error downloading audio file: {e}", 500

    input_audio_bytes = response.content

    # Now you can use input_audio_bytes in your Wav2LipModel

    f = modal.Function.lookup("wav2lip-simple", "Wav2LipModel.run_whisper")
    return f.remote(input_audio_bytes)

@app.route('/', methods=["GET"])
def home():
    return "hello"

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
