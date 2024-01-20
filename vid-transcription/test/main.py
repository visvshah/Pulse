import modal
f = modal.Function.lookup("wav2lip-simple", "Wav2LipModel.run_whisper")
with open("sound.mp3", "rb") as audio_file:
  input_audio_bytes = audio_file.read()
g = f.remote(input_audio_bytes)
print(g)