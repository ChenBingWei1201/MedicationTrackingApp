# Medication Tracking System - Mediapipe

## Requirements

- **Raspberry Pi (Rpi)**: Python, OpenCV, RTMP, FFmpeg
- **PC**: Python, MediaPipe, OpenCV, TensorFlow, RTMP, FFmpeg

## Usage

### Raspberry Pi
Start the RTMP service with the following command:
  ```bash
  ffmpeg -f v4l2 -i /dev/video0 -vcodec libx264 -preset ultrafast -tune zerolatency -maxrate 3000k -bufsize 6000k -f flv rtmp://<Rpi's IP address>/live/stream -rtmp_buffer 100000 -rtmp_live live
  ```

  *Tip:* Use `hostname -I` to find the Rpi's IP address and replace `<Rpi's IP address>` in the command.

### PC

Update the IP address in `app.py` from `'rtmp://192.168.127.199/live/stream'` to `0`.

## Run

### Set Environment Variables
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```bash
SUPABASE_URL=<your_supabase_url>
SUPABASE_KEY=<your_supabase_key>
EMAIL=<your_email>
PASSWORD=<your_password>
```

### Execute the Application
Run the application with:
```bash
python3 ./app.py
```