import os
from flask import Flask, request
import requests
import modal

app = Flask(__name__)

@app.route('/transcribe', methods=["GET", "POST"])
def transcript():
    f = modal.Function.lookup("wav2lip-simple", "Wav2LipModel.run_whisper")
    # request.args.get("link") can be your header and then you would call it as localhost/transcribe?link=<>
    
    # instead of this, make it so that you can read bytes from a link 
    # with open("<>", "rb") as audio_file:
    #     input_audio_bytes = audio_file.read()
    return f.remote(input_audio_bytes)

@app.route('/', methods=["GET"])
def home():
    return "hello"


if __name__ == "__main__":
    app.run(host= "0.0.0.0", debug=True)