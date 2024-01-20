import os
from flask import Flask, request
import requests
import modal
import random
CHUNK_SIZE = 1024

app = Flask(__name__)

voices = ["Elon", "Swift", "Obama", "Trump"]

voiceIds = {
  "Elon": "8sHPROQxTCYRn78WBEXm",
  "Swift": "BCsp8OKAuXlkDIPYKsal",
  "Obama": "E9q407AK8mMh2kVFqKkI",
  "Trump": "mdahQWJbejqapxG8TASB",
  "Jobs": "iSyIDEdiZxwn3Jge7R1c",
  "Serena": "cQQ8RX731Bdq0T0Pqqps"
}

voiceFiles = {
  "Elon": [1, 2],
  "Swift": [1],
  "Obama": [1, 2],
  "Trump": [1],
  "Jobs": [1, 2],
  "Serena": [1],
}

def sync_audio(audio_path, video_path):
  return 0

@app.route('/deepfake', methods=["GET", "POST"])
def deepfake():
    whichVoice = random.choice(voices)
    whichVideo = random.choice(voiceFiles[whichVoice])
    vidPath = f"deepfakes/{whichVoice.lower()}/{whichVoice.lower()}_video{whichVideo}.mp4"
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voiceIds[whichVoice]}"

    payload = {
        "model_id": "eleven_multilingual_v2",
        # "text": request.args.get("text"),
        "text": "In mathematics, a differential equation is an equation that relates one or more unknown functions and their derivatives. In applications, the functions generally represent physical quantities, the derivatives represent their rates of change, and the differential equation defines a relationship between the two. There are several different ways of solving differential equations, which I'll list in approximate order of popularity. I'll also classify them in a manner that differs from that found in text books.",
        "voice_settings": {
            "similarity_boost": 0.75,
            "stability": 0.5,
            "style": 0,
            "use_speaker_boost": True
        }
    }
    headers = {
      "Content-Type": "application/json",
      "xi-api-key": os.getenv('ELEVEN_API_KEY')
    }
    print(vidPath)
    response = requests.request("POST", url, json=payload, headers=headers)
    with open('output.mp3', 'wb') as f:
      for chunk in response.iter_content(chunk_size=CHUNK_SIZE):
          if chunk:
              f.write(chunk)
    f = modal.Function.lookup("wav2lip-simple", "Wav2LipModel.inference")
    with open("output.mp3", "rb") as audio_file:
        input_audio_bytes = audio_file.read()
    with open(vidPath, "rb") as video_file:
        input_video_bytes = video_file.read()
    out = f.remote(input_video_bytes, input_audio_bytes)
    print("finished calling remote")
    with open("out.mp4", "wb") as f:
        f.write(out)
    return "done"

@app.route('/brainrot', methods=["GET"])
def brainrot():
    return "hello"

@app.route('/', methods=["GET"])
def home():
    return "hello"


if __name__ == "__main__":
    app.run(host= "0.0.0.0", debug=True)



