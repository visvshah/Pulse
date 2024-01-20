import os
import moviepy.editor as mp
import random
import math
from gtts import gTTS 
from PIL import Image, ImageDraw, ImageFont
import cv2
import numpy
import modal
import json

font = ImageFont.load_default()

image_constants = {
	# img : (LETTERS_PER_LINE, LETTERS_IN_IMG)
	"elon.jpg" : (70, 200)
}

def parition_audio(script, img):
	sentences = script.split('.')[:-1]
	groups = []
	audio_obj = []
	cur = ""
	for x in sentences:
		print(x)
		if len(cur) + len(x) + 2 > image_constants[img][1]:
			audio = gTTS(text=cur, lang='en', slow=False) 
			name = "output/output" + str(len(groups))
			audio_obj += [audio]
			groups.append([cur, name])
			cur = ""
		else:
			cur += x + ". "

	if len(cur) > 0:
			audio = gTTS(text=cur, lang='en', slow=False) 
			name = "output/output" + str(len(groups))
			audio_obj += [audio]
			groups.append([cur, name])
			cur = ""

	assert(len(groups) == len(audio_obj))
	for i in range(len(groups)):
		audio_obj[i].save(groups[i][1] + ".mp3")

	return groups

def generate_audio(script):
	audio = gTTS(text=script, lang='en', slow=False) 
	audio.save("./output/output.mp3")
	return "./output/output.mp3"

def partition_sentences(audio_file, img):
	data = audio_to_timestamp(audio_file)["segments"]
	groups = []
	audio_obj = []
	cur = ""
	start = -1
	for info in data:
		text = info["text"]
		if start == -1:
			start = info["start"]
		end = info["end"]

		print(len(cur), image_constants[img][1])

		if len(cur) + len(text) > image_constants[img][1]:
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

def resize_img(img, vidW):
	opencvImage = numpy.asarray(img)
	opencvImage = cv2.cvtColor(opencvImage, cv2.COLOR_RGB2BGR)
	h, w, c = opencvImage.shape
	new_w = int(0.88 * vidW)
	new_h = int((new_w / w) * h)
	opencvImage = cv2.resize(opencvImage, (new_w, new_h))
	return Image.fromarray(cv2.cvtColor(opencvImage, cv2.COLOR_BGR2RGB))

def audio_to_timestamp(file):
	f = modal.Function.lookup("wav2lip-simple", "Wav2LipModel.run_whisper")
	with open(file, "rb") as audio_file:
		input_audio_bytes = audio_file.read()
	data = f.remote(input_audio_bytes)
	print(json.dumps(data, indent=4))
	return data

def make_image(script, path_tweet, tweet, vidW):
	img = Image.open(path_tweet + tweet)
	draw = ImageDraw.Draw(img)
	
	# font = ImageFont.truetype(<font-file>, <font-size>)
	font = ImageFont.truetype("helvetica.ttf", 34)

	# draw.text((x, y),"Sample Text",(r,g,b))
	
	words = script.split()
	cur = ""
	j = 0
	for word in words:
		if len(cur) + len(word) > image_constants[tweet][0]:
			draw.text((20, 120 + j * 37), cur, (0, 0, 0), font = font)
			cur = word
			j += 1
		else:
			cur += " " + word
	if len(cur) > 0:
		draw.text((20, 120 + j * 37), cur, (0, 0, 0), font = font)

	img = resize_img(img.copy(), vidW)
	
	img.save("./output/" + "output" + ".jpg")

def story_time(script):
	path_meme = "./brainrot/"
	path_tweet = "./tweets/"
	vids = os.listdir(path_meme)
	tweets = os.listdir(path_tweet)
	tweet = tweets[random.randint(0, len(tweets) - 1)]

	print(vids)

	meme = mp.VideoFileClip(path_meme + vids[random.randint(0, len(vids) - 1)])

	# final_vid = meme.copy()

	audio_file = generate_audio(script)

	audio = mp.AudioFileClip(audio_file)

	reqd_duration = audio.duration

	if meme.duration > reqd_duration:
		final_vid = meme.set_duration(math.ceil(reqd_duration))
	else:
		final_vid = meme.loop(duration = audio.duration)

	final_vid = final_vid.set_audio(audio)

	groups = partition_sentences(audio_file, tweet)
	print(groups)

	# print(audio_to_timestamp(audio_file))


	i = 0

	for [script, start, end] in groups:

		make_image(script, path_tweet, tweet, int(final_vid.w))
		i += 1

		print("wtf")
		title = mp.ImageClip("./output/output.jpg").set_start(start).set_duration(end).set_pos(("center","center")) 
		    # 
		x = numpy.asarray(title)
		print(x, x.shape)

		final_vid = mp.CompositeVideoClip([final_vid, title])

	final_vid.write_videofile("./output/output.mp4")

script = "Sociology is the scientific study of society, human behavior, and social interactions. It explores the structure, development, and functioning of human societies, analyzing how individuals and groups interact within various social contexts. Sociologists examine social institutions, such as family, education, and government, to understand their impact on individuals and society. Key concepts include social stratification, culture, norms, and social change. The discipline employs both qualitative and quantitative research methods to investigate patterns and trends in human behavior. Ultimately, sociology aims to uncover the underlying dynamics that shape societies and contribute to a deeper understanding of the complexities inherent in human social life."
story_time(script)