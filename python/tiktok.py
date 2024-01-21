from tiktokvoice import *
import random

def make_audio(script, vid_id):
	voices = [   
		'en_au_001',                  # English AU - Female
		'en_au_002',                  # English AU - Male
		'en_uk_001',                  # English UK - Male 1
		'en_us_001',                  # English US - Female (Int. 1)
		'en_us_001',                  # English US - Female (Int. 1)
		'en_us_001',                  # English US - Female (Int. 1)
		'en_us_002',                  # English US - Female (Int. 2)
		'en_us_002',                  # English US - Female (Int. 2)
		'en_us_006',                  # English US - Male 1
		'en_us_006',                  # English US - Male 1
		'en_us_007',                  # English US - Male 2
		'en_us_007',                  # English US - Male 2
	]
	tts(script, voices[random.randint(0, len(voices)-1)], f"./output/{vid_id}_output.mp3")
	return f"./output/{vid_id}_output.mp3"
