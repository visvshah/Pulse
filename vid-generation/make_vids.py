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
import assemblyai as aai
from moviepy.video.tools.subtitles import SubtitlesClip


START_COORD = 0
LETTERS_PER_LINE = 1
LETTERS_IN_IMG = 2

font = ImageFont.load_default()

image_constants = {
	# img : (LETTERS_PER_LINE, LETTERS_IN_IMG)
	"elon.jpg" : {
		START_COORD : (20, 120),
		LETTERS_PER_LINE : 70,
		LETTERS_IN_IMG : 500
	},
	"trump.png" : {
		START_COORD : (70, 170),
		LETTERS_PER_LINE : 70,
		LETTERS_IN_IMG : 600
	},
	"lebron.png" : {
		START_COORD : (50, 120),
		LETTERS_PER_LINE : 60,
		LETTERS_IN_IMG : 400
	},
	"subs.png" : {
		START_COORD : (20, 20),
		LETTERS_IN_IMG : 70,
		LETTERS_PER_LINE : 70,
	},
	"white.jpg" : {
		START_COORD : (20, 20),
		LETTERS_IN_IMG : 70,
		LETTERS_PER_LINE : 70,
	}
}

# def parition_audio(script, img):
# 	sentences = script.split('.')[:-1]
# 	groups = []
# 	audio_obj = []
# 	cur = ""
# 	for x in sentences:
# 		print(x)
# 		if len(cur) + len(x) + 2 > image_constants[img][1]:
# 			audio = gTTS(text=cur, lang='en', slow=False) 
# 			name = "output/output" + str(len(groups))
# 			audio_obj += [audio]
# 			groups.append([cur, name])
# 			cur = ""
# 		else:
# 			cur += x + ". "

# 	if len(cur) > 0:
# 			audio = gTTS(text=cur, lang='en', slow=False) 
# 			name = "output/output" + str(len(groups))
# 			audio_obj += [audio]
# 			groups.append([cur, name])
# 			cur = ""

# 	assert(len(groups) == len(audio_obj))
# 	for i in range(len(groups)):
# 		audio_obj[i].save(groups[i][1] + ".mp3")

# 	return groups

def generate_audio(script):
	audio = gTTS(text=script, lang='en', slow=False) 
	audio.save("./output/output.mp3")
	return "./output/output.mp3"

def generate_srt(audio_file):
	transcriber = aai.Transcriber()
	transcript = transcriber.transcribe(audio_file)
	srt = transcript.export_subtitles_srt()
	print(srt)
	with open("./output/subtitles.srt", "w") as f:
		f.write(srt)
	return "./output/subtitles.srt"

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

def make_image(script, path_tweet, tweet, final_vid, sz = 34):
	img = Image.open(path_tweet + tweet)
	draw = ImageDraw.Draw(img)
	
	# font = ImageFont.truetype(<font-file>, <font-size>)
	font = ImageFont.truetype("helvetica.ttf", sz)

	# draw.text((x, y),"Sample Text",(r,g,b))


	words = script.split()
	cur = ""
	j = 0
	x, y = image_constants[tweet][START_COORD]

	W = final_vid.w
	H = final_vid.h

	for word in words:
		if len(cur) + len(word) > image_constants[tweet][LETTERS_PER_LINE]:
			_, _, w, h = draw.textbbox((0, 0), cur, font=font)
			# draw.text(((W-w)/2, (H-h)/2), cur, font=font, fill=(0, 0, 0))
			draw.text((x, y + j * 37), cur, fill=(0, 0, 0), font = font)
			cur = word
			j += 1
		else:
			cur += " " + word
	if len(cur) > 0:
		_, _, w, h = draw.textbbox((0, 0), cur, font=font)
		# draw.text(((W-w)/2, (H-h)/2), cur, font=font, fill=(0, 0, 0))
		draw.text((x, y + j * 37), cur, fill=(0, 0, 0), font = font)

	img = resize_img(img.copy(), W)	
	img.save("./output/" + "output" + ".jpg")

def add_tweet(final_vid, audio_file, path_tweet, tweet):
	groups = partition_sentences(audio_file, tweet)
	print(groups)

	# print(audio_to_timestamp(audio_file))

	for [script, start, end] in groups:

		make_image(script, path_tweet, tweet, final_vid)

		title = mp.ImageClip("./output/output.jpg").set_start(start).set_duration(end).set_pos(("center","center")) 
			# 
		# x = numpy.asarray(title)
		# print(x, x.shape)

		final_vid = mp.CompositeVideoClip([final_vid, title])

	return final_vid

def add_subs(final_vid : mp.VideoFileClip, audio_file):
	groups = partition_sentences(audio_file, "white.jpg")
	# font = ImageFont.truetype("helvetica.ttf", 28)
	# generator = lambda txt: mp.TextClip(txt, font='helvetica.ttf', color='white')
	# subtitles = SubtitlesClip(file, generator)
	# result = mp.CompositeVideoClip([vid, subtitles.set_pos(('center','bottom'))])
	# return result

	print(groups)

	# print(audio_to_timestamp(audio_file))

	for [script, start, end] in groups:

		path_tweet = "./tweets/"

		# make_image(script, "", "transparent.png", int(final_vid.w))
		make_image(script, path_tweet, "white.jpg", final_vid, 70)
		# text_clip = mp.TextClip(txt="Python is Awesome!",
		#              size=(400, 0), 
		#              font="helvetica.ttf",
		#              color="black",     # Font color
		#              bg_color="white")   # Background color

		# loc = (final_vid.w // 4, final_vid.h - 100)
		title = mp.ImageClip("./output/output.jpg").set_start(start).set_duration(end).set_pos(("center", "center")) 
		
		# 
		# x = numpy.asarray(title)
		# print(x, x.shape)

		final_vid = mp.CompositeVideoClip([final_vid, title])

	return final_vid


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

	# final_vid = add_tweet(final_vid, audio_file, path_tweet, "white.jpg")
	final_vid = add_subs(final_vid, audio_file)

	final_vid.write_videofile("./output/output.mp4")

# script = "Sociology is the scientific study of society, human behavior, and social interactions. It explores the structure, development, and functioning of human societies, analyzing how individuals and groups interact within various social contexts. Sociologists examine social institutions, such as family, education, and government, to understand their impact on individuals and society. Key concepts include social stratification, culture, norms, and social change. The discipline employs both qualitative and quantitative research methods to investigate patterns and trends in human behavior. Ultimately, sociology aims to uncover the underlying dynamics that shape societies and contribute to a deeper understanding of the complexities inherent in human social life."
# story_time(script)

# s = "I am Saarang. I am testing the Trump tweet. I have no life. Sitting here and doing this stupid hackathon on a weekend instead of partying and working on randomized algorithm homework. "

# print(s)

# story_time(s)

# # generate_srt(generate_audio(s))

# path_meme = "./brainrot/"
# path_tweet = "./tweets/"
# tweets = os.listdir(path_tweet)
# # print("trump.png")

# tweet = "lebron.png"       # tweets[random.randint(0, len(tweets) - 1)]

# # make_image(s, path_tweet, tweet)