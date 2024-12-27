import os
import cv2
import sys
import mediapipe as mp
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()
rtmp_url = os.getenv("RTMP_URL")
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
email = os.getenv("EMAIL")
password = os.getenv("PASSWORD")
supabase: Client = create_client(url, key)

# Constants
COUNTER_INITIAL = -1
counter = COUNTER_INITIAL # Record which element is being compared
med_counter_threshold = 3 # Adjust the judgment threshold
med_counter = 0 # Prevent misjudgment due to jitter
Op = False
Op_w = False
time = []

# Sign in
def sign_in():
    account = {
        "email": email,
        "password": password
    }
    supabase.auth.sign_in_with_password(account)

# Get session
def get_session():
    return supabase.auth.get_session()

# Get profile
def get_profile(user_id: str):
    reponse = supabase.table("profiles").select("*").eq("id", user_id).execute()
    return reponse.data[0]

# Insert notification
def insert_notification(user_id: str, message: str):
    notification = {
        "user_id": user_id,
        "message": message,
        "read": False
    }
    return supabase.table("notifications").insert(notification).execute()

# Determine the time of day
def determine_time_of_day(now: int, timestamps: list) -> str:
    if int(timestamps[0]) <= now <= int(timestamps[1]):
        return "Morning"
    elif int(timestamps[2]) <= now <= int(timestamps[3]):
        return "Noon"
    elif int(timestamps[4]) <= now <= int(timestamps[5]):
        return "Night"
    else:
        return "Other"

# Insert medication log
def insert_medication_log(user_id: str, now: int, taken: bool, timestamps: list):
    time_of_day = determine_time_of_day(now, timestamps)
    medication_log = {
        "user_id": user_id,
        "time": time_of_day,
        "taken": taken,
        "date": datetime.now().strftime("%Y-%m-%d")
    }

    supabase.table("medication_logs").insert(medication_log).execute()
    
    message = f"Taking medicine at {datetime.now().strftime('%H:%M:%S')}." if taken else "Missed taking medicine!"
    insert_notification(user_id, message)

# Set timestamps
def set_timestamps(timestamps):
    global time, counter
    counter = COUNTER_INITIAL
    time = []
    row1 = []
    row2 = []
    try:
        for i in range(len(timestamps)):
            if i % 2 == 0:
                row1.append(int(timestamps[i]))
            else:
                row2.append(int(timestamps[i]))
        row1.append(999)
        row2.append(999)
        time.append(row1)
        time.append(row2)
    except Exception as e:
        print(f"Error0: {e}")

# Calculate the distance between two points
def calculate_distance(point1, point2):
    return ((point1.x - point2.x)**2 + (point1.y - point2.y)**2) ** 0.5

# Calculate the angle between three points
def calculate_angle(dist1, dist2, dist3):
    return (dist1**2 + dist2**2 - dist3**2) / (2 * dist1 * dist2)

# Detect the pose of taking medicine
def get_medicine_pose(hand_landmarks):
    thumb_tip = hand_landmarks.landmark[4] # Point 4

    index_mcp = hand_landmarks.landmark[5] # Point 5
    index_pip = hand_landmarks.landmark[6] # Point 6
    index_dip = hand_landmarks.landmark[7] # Point 7
    index_tip = hand_landmarks.landmark[8] # Point 8

    middle_pip = hand_landmarks.landmark[10] # Point 10
    middle_dip = hand_landmarks.landmark[11] # Point 11
    middle_tip = hand_landmarks.landmark[12] # Point 12

    ring_mcp = hand_landmarks.landmark[13] # Point 13
    ring_pip = hand_landmarks.landmark[14] # Point 14
    ring_dip = hand_landmarks.landmark[15] # Point 15
    ring_tip = hand_landmarks.landmark[16] # Point 16

    pinky_mcp = hand_landmarks.landmark[17] # Point 17
    pinky_pip = hand_landmarks.landmark[18] # Point 18
    pinky_dip = hand_landmarks.landmark[19] # Point 19
    pinky_tip = hand_landmarks.landmark[20] # Point 20

    # Confirm the distance and angle between the thumb and other fingers
    thumb_index_dist = calculate_distance(thumb_tip, index_tip)

    index_mp_dist = calculate_distance(index_mcp, index_pip) # Distance between 5 and 6
    index_pd_dist = calculate_distance(index_pip, index_dip) # Distance between 6 and 7
    index_dt_dist = calculate_distance(index_dip, index_tip) # Distance between 7 and 8
    index_md_dist = calculate_distance(index_mcp, index_dip) # Distance between 5 and 7
    index_pt_dist = calculate_distance(index_pip, index_tip) # Distance between 6 and 8

    middle_pd_dist = calculate_distance(middle_pip, middle_dip)
    # middle_dtip_dist = ((middle_dip.x - middle_tip.x)**2 + (middle_dip.y - middle_tip.y)**2) ** 0.5

    ring_mp_dist = calculate_distance(ring_mcp, ring_pip) # Distance between 13 and 14
    ring_pd_dist = calculate_distance(ring_pip, ring_dip) # Distance between 14 and 15
    ring_dt_dist = calculate_distance(ring_dip, ring_tip) # Distance between 15 and 16
    ring_md_dist = calculate_distance(ring_mcp, ring_dip) # Distance between 13 and 15
    ring_pt_dist = calculate_distance(ring_pip, ring_tip) # Distance between 14 and 16

    pinky_mp_dist = calculate_distance(pinky_mcp, pinky_pip) # Distance between 17 and 18
    pinky_pd_dist = calculate_distance(pinky_pip, pinky_dip) # Distance between 18 and 19
    pinky_dt_dist = calculate_distance(pinky_dip, pinky_tip) # Distance between 19 and 20
    pinky_md_dist = calculate_distance(pinky_mcp, pinky_dip) # Distance between 17 and 19
    pinky_pt_dist = calculate_distance(pinky_pip, pinky_tip) # Distance between 18 and 20

    index_angle0 = calculate_angle(index_mp_dist, index_pd_dist, index_md_dist) # Angle 6
    index_angle1 = calculate_angle(index_pd_dist, index_dt_dist, index_pt_dist) # Angle 7
    ring_angle0 = calculate_angle(ring_mp_dist, ring_pd_dist, ring_md_dist) # Angle 14
    ring_angle1 = calculate_angle(ring_pd_dist, ring_dt_dist, ring_pt_dist) # Angle 15
    pinky_angle0 = calculate_angle(pinky_mp_dist, pinky_pd_dist, pinky_md_dist) # Angle 18
    pinky_angle1 = calculate_angle(pinky_pd_dist, pinky_dt_dist, pinky_pt_dist) # Angle 19

    direction = index_tip.y > index_mcp.y

    taken = thumb_index_dist < 0.1 and index_angle0 < 0 and index_angle1 < 0 and middle_pd_dist < 0.1 and ring_pd_dist < 0.1 and \
                    pinky_pd_dist < 0.1 and ring_angle0 > 0 and ring_angle1 < 0 and pinky_angle0 > 0 and pinky_angle1 < 0 and direction

    return taken

# Start detection
def start_detect(user_id: str, timestamps: list):
    global counter, med_counter, med_counter_threshold, Op, Op_w, time
    mp_hands = mp.solutions.hands
    mp_drawing = mp.solutions.drawing_utils

    set_timestamps(timestamps)

    cap = cv2.VideoCapture(rtmp_url)

    with mp_hands.Hands(min_detection_confidence=0.5, min_tracking_confidence=0.5) as hands:
        while cap.isOpened():
            try:
                # Update time
                now = datetime.now(tz=timezone(timedelta(hours=8)))
                sec = now.second # demo: now.second, real: now.hour

                if sec == 0:
                    counter = 0
                    med_counter = 0
                    Op_w = False

                if counter == COUNTER_INITIAL:
                    counter = 0
                    Op_w = False
                    try:
                        for i in range(len(time[0])):
                            if  sec > time[1][i]:
                                counter += 1
                    except Exception as e:
                        print(f"Error1: {e}")

                # Record missed medication time
                if sec > time[1][counter]:
                    if med_counter < med_counter_threshold:
                        insert_medication_log(user_id, int(str(now.second)), False, timestamps)
                    counter += 1
                    med_counter = 0
                    Op_w = False

                # Record medication time
                if med_counter >= med_counter_threshold and not Op_w:
                    insert_medication_log(user_id, int(str(now.second)), True, timestamps)
                    Op = False
                    Op_w = True

                ret, frame = cap.read()
                if not ret:
                    sys.exit('ERROR: Unable to read from webcam. Please verify your webcam settings.')

                image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                image.flags.writeable = False
                results = hands.process(image)

                # Convert back to BGR for display
                image.flags.writeable = True
                image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

                # Detect hand position
                if results.multi_hand_landmarks:
                    for hand_landmarks in results.multi_hand_landmarks:
                        # Draw hand structure
                        mp_drawing.draw_landmarks(image, hand_landmarks, mp_hands.HAND_CONNECTIONS)

                        # Check if conditions are met
                        if get_medicine_pose(hand_landmarks):
                            cv2.putText(image, "Get Medicine!", (10, 50),
                                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
                            if Op:
                                med_counter += 1
                            Op = True
                        else:
                            cv2.putText(image, "Not Get Medicine", (10, 50),
                                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
                            if med_counter < med_counter_threshold:
                                med_counter = 0
                else:
                    cv2.putText(image, "Hands Not Detected!", (10, 50),
                                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
                    if med_counter < med_counter_threshold:
                        med_counter = 0
                            
                cv2.putText(image, "Time:" + str(sec), (850, 750),
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 0), 2, cv2.LINE_AA)
                
                if sec < time[0][counter] and counter + 1 < len(time[0]):
                    Op = False

                # Display image
                cv2.imshow("MediaPipe Hand Detection", image)

                if cv2.waitKey(5) & 0xFF == 27:
                    break

            except Exception as e:
                print(f"Error3: {e}")

    cap.release()
    cv2.destroyAllWindows()

# Main
if __name__ == "__main__":
    user_id = ""
    sign_in()

    session = get_session()
    if session:
        user_id = session.user.id
    else:
        print("No session found")

    profile = get_profile(user_id)
    timestamps = profile["timestamps"]

    start_detect(user_id, timestamps)