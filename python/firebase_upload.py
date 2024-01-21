from firebase_admin import credentials, initialize_app, storage

def init_firebase():
	cred = credentials.Certificate("./accountKey.json")
	initialize_app(cred, {'storageBucket': 'auth-development-f2bc9.appspot.com'})

def upload_file(source, dest):
	# source -> source file on local machine /folder/vid.mp4
	# dest -> dest location on firebase i.e videos/vid.mp4 
	# (dont add /videos, it makes a new folder '/' and a folder videos in /)
	# it makes entire dest folder path in firebase 
	# name of video is needed in both source and dest
	bucket = storage.bucket()
	blob = bucket.blob(dest)
	blob.upload_from_filename(source)
	blob.make_public()
	# print("your file url", blob.public_url)
	return blob.public_url

# upload_file("./brainrot/gta.mp4", "videos/gta.mp4")