from flask import Flask
import requests
CHUNK_SIZE = 1024

app = Flask(__name__)

voices = ["Elon", "Swift", "Obama", "Kanye", "Lebron", "Trump"]

voiceIds = {
  "Elon": "8sHPROQxTCYRn78WBEXm",
  "Swift": "BCsp8OKAuXlkDIPYKsal",
  "Obama": "E9q407AK8mMh2kVFqKkI",
  "Kanye": "PcA2u0ij3PJSr1XcE1Yo",
  "Lebron": "TttZdgdCngwcVo20eMGF",
  "Trump": "mdahQWJbejqapxG8TASB"
}

@app.route('/deepfake', methods=["GET"])
def deepfake():
    # url = f"https://api.elevenlabs.io/v1/text-to-speech/8sHPROQxTCYRn78WBEXm"

    # payload = {
    #     "model_id": "eleven_multilingual_v2",
    #     "text": "Hi I am Saarang, and I have no friends.",
    #     "voice_settings": {
    #         "similarity_boost": 0.75,
    #         "stability": 0.5,
    #         "style": 0,
    #         "use_speaker_boost": True
    #     }
    # }
    # headers = {
    #   "Content-Type": "application/json",
    #   "xi-api-key": "9a3db95271bcc0aef2c8f83b770e97d3"
    # }

    # response = requests.request("POST", url, json=payload, headers=headers)
    # with open('output.mp3', 'wb') as f:
    #   for chunk in response.iter_content(chunk_size=CHUNK_SIZE):
    #       if chunk:
    #           f.write(chunk)

    return "feepdake"

@app.route('/brainrot', methods=["GET"])
def brainrot():
    return "hello"

@app.route('/', methods=["GET"])
def home():
    return "hello"


if __name__ == "__main__":
    app.run(host= "0.0.0.0", debug=True)



