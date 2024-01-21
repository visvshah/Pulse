import os
import subprocess
from io import BytesIO
from pathlib import Path
from typing import List
import whisper
import uuid0

import modal
from modal import Image, Stub, gpu, method

image = (
    Image.debian_slim(python_version='3.9.17')
    .apt_install(["git", "wget", "curl", "ffmpeg"])
    .pip_install("gdown")
    .pip_install("openai-whisper")
    .pip_install("uuid0")
    .pip_install_from_requirements("requirements.txt")
    .copy_local_dir("inference", "/root/inference")
    .workdir("/root/inference")
    .run_commands("wget 'https://iiitaphyd-my.sharepoint.com/personal/radrabha_m_research_iiit_ac_in/_layouts/15/download.aspx?share=EdjI7bZlgApMqsVoEUUXpLsBxqXbn5z8VTmoxp55YNDcIA' -O checkpoints/wav2lip_gan.pth")
    
)

stub = Stub("wav2lip-simple", image=image)

@stub.cls(gpu=modal.gpu.A100(memory=80), container_idle_timeout=240)
class Wav2LipModel:
    def __enter__(self):
        self.setup_dependencies()

    def setup_dependencies(self):
        # empty for now
        self.whisper_model = whisper.load_model("base")
        return 0
    
    @method()
    def inference(self, video_bytes: bytes, audio_bytes: bytes, vid_id: str) -> bytes:
        video_path = f'/tmp/{vid_id}_video.mp4'
        audio_path = f'/tmp/{vid_id}_audio.mp3'
        with open(video_path, 'wb') as video_file:
            video_file.write(video_bytes)
        with open(audio_path, 'wb') as audio_file:
            audio_file.write(audio_bytes)

        output_file_path = f'/tmp/{vid_id}_result_voice.mp4'

        subprocess.run(["sed", "-i", "s/from numba.decorators import jit as optional_jit/from numba import jit as optional_jit/g",
                       "/usr/local/lib/python3.9/site-packages/librosa/util/decorators.py"])
        subprocess.run(["mkdir", "temp"])
        subprocess.run(["python", "Wav2Lip.py", "--id", vid_id])

        # try:
        with open(output_file_path, 'rb') as output_file:
            result_video_bytes = output_file.read()
        return result_video_bytes
        # except:
        # with open("temp/faulty_frame.jpg", 'rb') as output_file:
        #     result_video_bytes = output_file.read()
        # return result_video_bytes
    
    @method()
    def run_whisper(self, audio_bytes: bytes, vid_id: str) -> dict:
        audio_path = f'/tmp/{vid_id}_audio.mp3'
        with open(audio_path, 'wb') as audio_file:
            audio_file.write(audio_bytes)
        return self.whisper_model.transcribe(audio_path)

# @stub.local_entrypoint()
# def main(
#     video_path="/Users/sarthakmangla/code/Pulse/python/deepfakes/serena/serena_video1.mp4",
#     audio_path="/Users/sarthakmangla/Downloads/topology.mp3",
# ):
#     with open(video_path, "rb") as video_file:
#         input_video_bytes = video_file.read()
#     with open(audio_path, "rb") as audio_file:
#         input_audio_bytes = audio_file.read()
#     uuid = uuid0.generate()
#     output_video_bytes = Wav2LipModel().inference.remote(input_video_bytes, input_audio_bytes, str(uuid))

#     output_path = Path(__file__).parent / "out.mp4"
#     print(f"Saving it to {output_path}")
#     with open(output_path, "wb") as f:
#         f.write(output_video_bytes)