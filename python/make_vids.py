# import os
# import moviepy.editor as mp
# import random
# import math
# from gtts import gTTS 
# from PIL import Image, ImageDraw, ImageFont
# import cv2
# import numpy
# import modal
# import json
# import assemblyai as aai
# from moviepy.video.tools.subtitles import SubtitlesClip
# from pydub import AudioSegment


# START_COORD = 0
# LETTERS_PER_LINE = 1
# LETTERS_IN_IMG = 2

# font = ImageFont.load_default()

# image_constants = {
# 	# img : (LETTERS_PER_LINE, LETTERS_IN_IMG)
# 	"elon.jpg" : {
# 		START_COORD : (30, 150),
# 		LETTERS_PER_LINE : 70,
# 		LETTERS_IN_IMG : 200
# 	},
# 	"trump.png" : {
# 		START_COORD : (70, 190),
# 		LETTERS_PER_LINE : 70,
# 		LETTERS_IN_IMG : 300
# 	},
# 	"lebron.png" : {
# 		START_COORD : (50, 150),
# 		LETTERS_PER_LINE : 60,
# 		LETTERS_IN_IMG : 150
# 	}
# }

# # def parition_audio(script, img):
# # 	sentences = script.split('.')[:-1]
# # 	groups = []
# # 	audio_obj = []
# # 	cur = ""
# # 	for x in sentences:
# # 		print(x)
# # 		if len(cur) + len(x) + 2 > image_constants[img][1]:
# # 			audio = gTTS(text=cur, lang='en', slow=False) 
# # 			name = "output/output" + str(len(groups))
# # 			audio_obj += [audio]
# # 			groups.append([cur, name])
# # 			cur = ""
# # 		else:
# # 			cur += x + ". "

# # 	if len(cur) > 0:
# # 			audio = gTTS(text=cur, lang='en', slow=False) 
# # 			name = "output/output" + str(len(groups))
# # 			audio_obj += [audio]
# # 			groups.append([cur, name])
# # 			cur = ""

# # 	assert(len(groups) == len(audio_obj))
# # 	for i in range(len(groups)):
# # 		audio_obj[i].save(groups[i][1] + ".mp3")

# # 	return groups

# def generate_audio(script):
# 	audio = gTTS(text=script, lang='en', slow=False) 
# 	audio.save("./output/output.mp3")
# 	audio = AudioSegment.from_mp3("./output/output.mp3")
# 	audio = audio.speedup(playback_speed=1.5)
# 	audio.export("./output/output.mp3", format="mp3")
# 	return "./output/output.mp3"

# def generate_srt(audio_file):
# 	transcriber = aai.Transcriber()
# 	transcript = transcriber.transcribe(audio_file)
# 	srt = transcript.export_subtitles_srt()
# 	print(srt)
# 	with open("./output/subtitles.srt", "w") as f:
# 		f.write(srt)
# 	return "./output/subtitles.srt"

# def partition_sentences(audio_file, img):
# 	data = audio_to_timestamp(audio_file)["segments"]
# 	groups = []
# 	audio_obj = []
# 	cur = ""
# 	start = -1
# 	for info in data:
# 		text = info["text"].strip().capitalize()
# 		if start == -1:
# 			start = info["start"]
# 		end = info["end"]

# 		if len(cur) + len(text) > image_constants[img][LETTERS_IN_IMG]:
# 			groups.append([cur, start, end])
# 			cur = text
# 			start = info["start"]
# 			end = info["end"]
# 		else:
# 			cur += text

# 	if len(cur) > 0:
# 		groups.append([cur, start, data[-1]["end"]])
# 		cur = ""
# 		start = -1

# 	return groups

# 	if len(cur) > 0:
# 		groups.append([cur, start, data[-1]["end"]])
# 		cur = ""
# 		start = -1

# 	return groups

# def resize_img(img, vidW):
# 	opencvImage = numpy.asarray(img)
# 	opencvImage = cv2.cvtColor(opencvImage, cv2.COLOR_RGB2BGR)
# 	h, w, c = opencvImage.shape
# 	new_w = int(0.88 * vidW)
# 	new_h = int((new_w / w) * h)
# 	opencvImage = cv2.resize(opencvImage, (new_w, new_h))
# 	return Image.fromarray(opencvImage)

# def audio_to_timestamp(file):
# 	f = modal.Function.lookup("wav2lip-simple", "Wav2LipModel.run_whisper")
# 	with open(file, "rb") as audio_file:
# 		input_audio_bytes = audio_file.read()
# 	data = f.remote(input_audio_bytes)
# 	print(json.dumps(data, indent=4))
# 	return data

# def make_image(script, path_tweet, tweet, final_vid, sz = 34):
# 	img = Image.open(path_tweet + tweet)
# 	draw = ImageDraw.Draw(img)
	
# 	font = ImageFont.truetype("helvetica.ttf", sz)

# 	script = script.replace(".", ". ")
# 	words = script.split()
# 	cur = ""
# 	j = 0
# 	x, y = image_constants[tweet][START_COORD]

# 	W = final_vid.w
# 	H = final_vid.h

# 	for word in words:
# 		if len(cur) + len(word) > image_constants[tweet][LETTERS_PER_LINE]:
# 			_, _, w, h = draw.textbbox((0, 0), cur, font=font)
# 			draw.text((x, y + j * 37), cur, fill=(0, 0, 0), font = font)
# 			cur = word
# 			j += 1
# 		else:
# 			if len(cur) != 0 and cur[-1] != " ":
# 				cur += " " + word
# 			else:
# 				cur += word
# 	if len(cur) > 0:
# 		_, _, w, h = draw.textbbox((0, 0), cur, font=font)
# 		draw.text((x, y + j * 37), cur, fill=(0, 0, 0), font = font)

# 	img = resize_img(img.copy(), W)	
# 	img.save("./output/" + "tweet" + ".jpg")

# def add_tweet(final_vid, audio_file, path_tweet, tweet):
# 	groups = partition_sentences(audio_file, tweet)
# 	print(groups)
# 	out = cv2.VideoWriter('test_out.mp4',cv2.VideoWriter_fourcc(*'DIVX'), final_vid.fps, (final_vid.w, final_vid.h))
# 	curr = 1
# 	vid = cv2.VideoCapture("./output/output.mp4")
# 	while vid.isOpened():
# 		flag, frame = vid.read()
# 		if not flag:
# 			break
# 		img = Image.fromarray(frame)
# 		secs = curr / final_vid.fps
# 		curr += 1
		
# 		for [script, start, end] in groups:
# 			if start <= secs and secs <= end:
# 				make_image(script, path_tweet, tweet, final_vid)
# 				tweet_img = Image.open("./output/tweet.jpg")
# 				img.paste(tweet_img, ((img.size[0] - tweet_img.size[0])//2, (img.size[1] - tweet_img.size[1])//2))

# 		img = numpy.array(img)
# 		out.write(img)

# 	out.release()
# 	final_vid = mp.VideoFileClip('test_out.mp4')

# 	return final_vid

# def add_subs(final_vid : mp.VideoFileClip, audio_file):
# 	groups = partition_sentences(audio_file, "white.jpg")
# 	# font = ImageFont.truetype("helvetica.ttf", 28)
# 	# generator = lambda txt: mp.TextClip(txt, font='helvetica.ttf', color='white')
# 	# subtitles = SubtitlesClip(file, generator)
# 	# result = mp.CompositeVideoClip([vid, subtitles.set_pos(('center','bottom'))])
# 	# return result

# 	print(groups)

# 	# print(audio_to_timestamp(audio_file))

# 	for [script, start, end] in groups:

# 		path_tweet = "./tweets/"

# 		# make_image(script, "", "transparent.png", int(final_vid.w))
# 		make_image(script, path_tweet, "white.jpg", final_vid, 70)
# 		# text_clip = mp.TextClip(txt="Python is Awesome!",
# 		#              size=(400, 0), 
# 		#              font="helvetica.ttf",
# 		#              color="black",     # Font color
# 		#              bg_color="white")   # Background color

# 		# loc = (final_vid.w // 4, final_vid.h - 100)
# 		title = mp.ImageClip("./output/output.jpg").set_start(start).set_duration(end).set_pos(("center", "center")) 
		
# 		# 
# 		# x = numpy.asarray(title)
# 		# print(x, x.shape)

# 		final_vid = mp.CompositeVideoClip([final_vid, title])

# 	return final_vid

# def process_deepfake(filename):
# 	curr = 1
# 	target_aspect_ratio = 9 / 16
# 	vid = cv2.VideoCapture(filename)
# 	width, height = int(vid.get(cv2.CAP_PROP_FRAME_WIDTH)), int(vid.get(cv2.CAP_PROP_FRAME_HEIGHT))
# 	actual_height = int(width / target_aspect_ratio)

# 	out = cv2.VideoWriter('test_out.mp4',cv2.VideoWriter_fourcc(*'DIVX'), vid.get(cv2.CAP_PROP_FPS), (width, actual_height))
# 	while vid.isOpened():
# 		flag, frame = vid.read()
# 		if not flag:
# 			break
# 		img = Image.fromarray(frame)
# 		curr += 1
		
# 		pad_top = (actual_height - height) // 2
# 		pad_bottom = actual_height - height - pad_top
# 		padded_image = Image.new('RGB', (width, actual_height), color=(0, 0, 0))
# 		padded_image.paste(img, (0, pad_top))

# 		padded_image = numpy.array(padded_image)
# 		out.write(padded_image)

# 	out.release()


# def story_time(script):
# 	path_meme = "./brainrot/"
# 	path_tweet = "./tweets/"
# 	vids = os.listdir(path_meme)
# 	tweets = os.listdir(path_tweet)
# 	tweet = tweets[random.randint(0, len(tweets) - 1)]


# 	meme = mp.VideoFileClip(path_meme + vids[random.randint(0, len(vids) - 1)])

# 	# final_vid = meme.copy()

# 	audio_file = generate_audio(script)

# 	audio = mp.AudioFileClip(audio_file)

# 	reqd_duration = audio.duration

# 	if meme.duration > reqd_duration:
# 		final_vid = meme.set_duration(math.ceil(reqd_duration))
# 	else:
# 		final_vid = meme.loop(duration = audio.duration)

# 	final_vid = final_vid.set_audio(audio)
# 	final_vid.write_videofile("./output/output.mp4", bitrate="2000k", audio_codec="aac", codec="h264_videotoolbox")

# 	final_vid = add_tweet(final_vid, audio_file, path_tweet, "trump.png")
# 	final_vid = final_vid.set_audio(audio)
# 	# # final_vid = add_subs(final_vid, audio_file)
# 	final_vid.write_videofile("./output/output.mp4", bitrate="2000k", audio_codec="aac", codec="h264_videotoolbox")

# script = "Sociology is the scientific study of society, human behavior, and social interactions. It explores the structure, development, and functioning of human societies, analyzing how individuals and groups interact within various social contexts. Sociologists examine social institutions, such as family, education, and government, to understand their impact on individuals and society. Key concepts include social stratification, culture, norms, and social change. The discipline employs both qualitative and quantitative research methods to investigate patterns and trends in human behavior. Ultimately, sociology aims to uncover the underlying dynamics that shape societies and contribute to a deeper understanding of the complexities inherent in human social life."
# story_time(script)
# # process_deepfake("asdf")

# # s = "I am Saarang. I am testing the Trump tweet. I have no life. Sitting here and doing this stupid hackathon on a weekend instead of partying and working on randomized algorithm homework. "

# # print(s)

# # story_time(s)

# # # generate_srt(generate_audio(s))

# # path_meme = "./brainrot/"
# # path_tweet = "./tweets/"
# # tweets = os.listdir(path_tweet)
# # # # print("trump.png")

# # # tweet = "lebron.png"       # tweets[random.randint(0, len(tweets) - 1)]

# # make_image(s, path_tweet, tweet)