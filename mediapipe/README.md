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

_Tip:_ Use `hostname -I` to find the Rpi's IP address and replace `<Rpi's IP address>` in the command.

## Run

### Set Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```bash
RTMP_URL="rtmp://<Rpi's IP address>/live/stream"
SUPABASE_URL=<your_supabase_url>
SUPABASE_KEY=<your_supabase_key>
EMAIL=<your_email>
PASSWORD=<your_password>
```

- Rpi: remember to replace `<Rpi's IP address>` with the actual IP address of the Raspberry Pi.
- PC: set `RTMP_URL` to `0`.

### Execute the Application

Run the application with:

```bash
# MedicationTrackingApp/mediapipe
python3 ./app.py
```
