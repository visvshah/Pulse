import uuid0
import os
from flask import Flask, request
from flask_cors import CORS
import requests
import modal
import random
import random
import moviepy.editor as mp
from moviepy.editor import *
from gtts import gTTS 
from PIL import Image, ImageDraw, ImageFont
import json
import numpy
import cv2
import math
from pydub import AudioSegment
from tiktok import make_audio
from firebase_upload import init_firebase, upload_file
CHUNK_SIZE = 1024

app = Flask(__name__)
CORS(app)

voices = ["Elon", "Swift", "Obama", "Trump", "Jobs", "Serena"]

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

START_COORD = 0
LETTERS_PER_LINE = 1
LETTERS_IN_IMG = 2

image_constants = {
  "elon.jpg" : {
    START_COORD : (30, 150),
    LETTERS_PER_LINE : 70,
    LETTERS_IN_IMG : 200
  },
  "trump.png" : {
    START_COORD : (70, 190),
    LETTERS_PER_LINE : 70,
    LETTERS_IN_IMG : 300
  },
  "lebron.png" : {
    START_COORD : (50, 150),
    LETTERS_PER_LINE : 60,
    LETTERS_IN_IMG : 150
  }
}


def generate_audio(script):
  audio = gTTS(text=script, lang='en', slow=False) 
  audio.save("./output/output.mp3")
  audio = AudioSegment.from_mp3("./output/output.mp3")
  audio = audio.speedup(playback_speed=1.5)
  audio.export("./output/output.mp3", format="mp3")
  return "./output/output.mp3"

def audio_to_timestamp(file):
  f = modal.Function.lookup("wav2lip-simple", "Wav2LipModel.run_whisper")
  with open(file, "rb") as audio_file:
    input_audio_bytes = audio_file.read()
  data = f.remote(input_audio_bytes)
  return data

def edit_deepfake_video(filename, audio_file):
  audio = mp.AudioFileClip(audio_file)
  data = audio_to_timestamp(audio_file)["segments"]
  words = []
  for group in data:
    words_script = list(filter(None, group['text'].split(" ")))
    if len(words_script) == 0:
      continue
    div = (group['end'] - group['start']) / len(words_script)
    curr_start = group['start']
    for i in words_script:
      words.append([i, curr_start, curr_start + div])
      curr_start += div

  curr = 1
  target_aspect_ratio = 9 / 16
  vid = cv2.VideoCapture(filename)
  width, height = int(vid.get(cv2.CAP_PROP_FRAME_WIDTH)), int(vid.get(cv2.CAP_PROP_FRAME_HEIGHT))
  actual_height = int(width / target_aspect_ratio)

  out = cv2.VideoWriter('./output/vertical_out.mp4',cv2.VideoWriter_fourcc(*'DIVX'), vid.get(cv2.CAP_PROP_FPS), (width, actual_height))
  while vid.isOpened():
    flag, frame = vid.read()
    if not flag:
      break
    img = Image.fromarray(frame)
    curr += 1
    
    pad_top = (actual_height - height) // 2
    pad_bottom = actual_height - height - pad_top
    padded_image = Image.new('RGB', (width, actual_height), color=(0, 0, 0))
    padded_image.paste(img, (0, pad_top))
    secs = curr / vid.get(cv2.CAP_PROP_FPS)
    for [script, start, end] in words:
      if start <= secs and secs <= end:			
        # print(secs, curr, script)
        d = ImageDraw.Draw(padded_image)
        for sz in range(10, 100):
          fnt =  ImageFont.truetype("Freshman-POdx.ttf", sz)
          _, _, w, h = d.textbbox((0, 0), script.upper(), font=fnt)
          if w > width-50:
            break
        d.text(((width-w)/2, (actual_height-h)/2 + (actual_height/4)), script.upper(), font=fnt, fill=(255, 255, 255))

    padded_image = numpy.array(padded_image)
    out.write(padded_image)
    
  out.release()

def resize_img(img, vidW):
  opencvImage = numpy.asarray(img)
  opencvImage = cv2.cvtColor(opencvImage, cv2.COLOR_RGB2BGR)
  h, w, c = opencvImage.shape
  new_w = int(0.88 * vidW)
  new_h = int((new_w / w) * h)
  opencvImage = cv2.resize(opencvImage, (new_w, new_h))
  return Image.fromarray(opencvImage)

def make_image(script, path_tweet, tweet, final_vid, sz = 34):
  img = Image.open(path_tweet + tweet)
  draw = ImageDraw.Draw(img)
  
  font = ImageFont.truetype("helvetica.ttf", sz)

  script = script.replace(".", ". ")
  words = script.split()
  cur = ""
  j = 0
  x, y = image_constants[tweet][START_COORD]

  W = final_vid.w
  H = final_vid.h

  for word in words:
    if len(cur) + len(word) > image_constants[tweet][LETTERS_PER_LINE]:
      _, _, w, h = draw.textbbox((0, 0), cur, font=font)
      draw.text((x, y + j * 37), cur, fill=(0, 0, 0), font = font)
      cur = word
      j += 1
    else:
      if len(cur) != 0 and cur[-1] != " ":
        cur += " " + word
      else:
        cur += word
  if len(cur) > 0:
    _, _, w, h = draw.textbbox((0, 0), cur, font=font)
    draw.text((x, y + j * 37), cur, fill=(0, 0, 0), font = font)

  img = resize_img(img.copy(), W)	
  img.save("./output/" + "tweet" + ".jpg")

def partition_sentences(audio_file, img):
  data = audio_to_timestamp(audio_file)["segments"]
  groups = []
  audio_obj = []
  cur = ""
  start = -1
  for info in data:
    text = info["text"].strip().capitalize()
    if start == -1:
      start = info["start"]
    end = info["end"]

    if len(cur) + len(text) > image_constants[img][LETTERS_IN_IMG]:
      groups.append([cur, start, end])
      cur = text
      start = info["start"]
      end = info["end"]
    else:
      cur += text

  if len(cur) > 0:
    groups.append([cur, start, data[-1]["end"]])
    cur = ""
    start = -1

  return groups

  if len(cur) > 0:
    groups.append([cur, start, data[-1]["end"]])
    cur = ""
    start = -1

  return groups


def add_tweet(final_vid, audio_file, path_tweet, tweet):
  groups = partition_sentences(audio_file, tweet)
  # print(groups)
  out = cv2.VideoWriter('./output/test_out.mp4',cv2.VideoWriter_fourcc(*'DIVX'), final_vid.fps, (final_vid.w, final_vid.h))
  curr = 1
  vid = cv2.VideoCapture("./output/output.mp4")
  while vid.isOpened():
    flag, frame = vid.read()
    if not flag:
      break
    img = Image.fromarray(frame)
    secs = curr / final_vid.fps
    curr += 1
    
    for [script, start, end] in groups:
      if start <= secs and secs <= end:
        make_image(script, path_tweet, tweet, final_vid)
        tweet_img = Image.open("./output/tweet.jpg")
        img.paste(tweet_img, ((img.size[0] - tweet_img.size[0])//2, (img.size[1] - tweet_img.size[1])//2))

    img = numpy.array(img)
    out.write(img)

  out.release()
  final_vid = mp.VideoFileClip('./output/test_out.mp4')

  return final_vid

def generate_deepfake(script):
    whichVoice = random.choice(voices)
    whichVideo = random.choice(voiceFiles[whichVoice])
    print(whichVoice, whichVideo)
    vidPath = f"deepfakes/{whichVoice.lower()}/{whichVoice.lower()}_video{whichVideo}.mp4"
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voiceIds[whichVoice]}"

    payload = {
        "model_id": "eleven_multilingual_v2",
        "text": script,
        "voice_settings": {
            "similarity_boost": 0.75,
            "stability": 0.5,
            "style": 0,
            "use_speaker_boost": True
        }
    }
    headers = {
      "Content-Type": "application/json",
      "xi-api-key": "9a3db95271bcc0aef2c8f83b770e97d3"
    }
    response = requests.request("POST", url, json=payload, headers=headers)
    with open('./output/output.mp3', 'wb') as f:
      for chunk in response.iter_content(chunk_size=CHUNK_SIZE):
          if chunk:
              f.write(chunk)
    f = modal.Function.lookup("wav2lip-simple", "Wav2LipModel.inference")
    with open("./output/output.mp3", "rb") as audio_file:
        input_audio_bytes = audio_file.read()
    with open(vidPath, "rb") as video_file:
        input_video_bytes = video_file.read()
    out = f.remote(input_video_bytes, input_audio_bytes)
    with open("./output/out.mp4", "wb") as f:
        f.write(out)
    edit_deepfake_video("./output/out.mp4", "./output/output.mp3")
    audio = mp.AudioFileClip("./output/output.mp3")
    final_vid = mp.VideoFileClip('./output/vertical_out.mp4')
    final_vid = final_vid.set_audio(audio)
    final_vid.write_videofile("./output/output.mp4", bitrate="2000k", audio_codec="aac", codec="h264_videotoolbox")
    return "done"


def generate_brainrot(script):
  brainrots_tmp = os.listdir("brainrot")
  brainrots = []
  for x in brainrots_tmp:
    if "mp4" in x:
      brainrots.append(x)
  whichBrainrot = "brainrot/" + random.choice(brainrots)
  whichTweet = random.choice(["elon.jpg", "trump.png", "lebron.png"])
  print(whichBrainrot, whichTweet)
  meme = mp.VideoFileClip(whichBrainrot)
  audio_file = make_audio(script)
  audio = mp.AudioFileClip(audio_file)
  reqd_duration = audio.duration

  if meme.duration > reqd_duration:
    final_vid = meme.set_duration(math.ceil(reqd_duration))
  else:
    final_vid = meme.loop(duration = audio.duration)

  final_vid = final_vid.set_audio(audio)
  final_vid.write_videofile("./output/output.mp4", bitrate="2000k", audio_codec="aac", codec="h264_videotoolbox")

  final_vid = add_tweet(final_vid, audio_file, "tweets/", whichTweet)
  final_vid = final_vid.set_audio(audio)
  final_vid.write_videofile("./output/output.mp4", bitrate="2000k", audio_codec="aac", codec="h264_videotoolbox")
  return "done"

@app.route('/getvideo', methods=["GET", "POST"])
def getvideo():
  whichType = random.choice([0, 1])
  if whichType == 0:
    generate_brainrot(request.args.get("text"))
  else:
    generate_deepfake(request.args.get("text"))
  vid_id = uuid0.generate()
  blob = upload_file("./output/output.mp4", f"videos/{vid_id}.mp4")
  # push to firebase
  out ={  
    "url": blob
  }  
  json_out = json.dumps(out, indent = 4) 
  return json_out

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
    init_firebase()
    app.run(host= "0.0.0.0", debug=True)



