from tiktokvoice import *
import random

def make_audio(script):
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
	tts(script, voices[random.randint(0, len(voices)-1)], "./output/output.mp3")

s = "Sociology is the scientific study of society, human behavior, and social interactions. It explores the structure, development, and functioning of human societies, analyzing how individuals and groups interact within various social contexts. Sociologists examine social institutions, such as family, education, and government, to understand their impact on individuals and society. Key concepts include social stratification, culture, norms, and social change. The discipline employs both qualitative and quantitative research methods to investigate patterns and trends in human behavior. Ultimately, sociology aims to uncover the underlying dynamics that shape societies and contribute to a deeper understanding of the complexities inherent in human social life."

make_audio(s)