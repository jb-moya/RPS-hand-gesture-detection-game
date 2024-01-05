# coding: utf-8
import eel
from ultralytics import YOLO
import cv2
import math
import numpy as np
import base64
import sys
import time

@eel.expose
def hello():
    print('hello')

classNames = ["rock", "paper", "scissors"]

model = YOLO("./src/assets/handPRO.pt")

# @eel.expose
# def detect():
#     # wait for some time
#     time.sleep(.2)

#     # return random choice: rock, paper, siccsors
#     return np.random.choice(classNames)


@eel.expose
def detect(encoded_img, confThreshSelected, width, height):
    img_data = base64.b64decode(encoded_img.split(',')[1])
    nparr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    results = model(img, max_det=1, conf=confThreshSelected)
    bounding_boxes = []

    for r in results:
        boxes = r.boxes

        for box in boxes:
            x1, y1, x2, y2 = box.xyxy[0]
            x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)

            x1_disp, y1_disp = int(x1 * (width / img.shape[1])), int(y1 * (height / img.shape[0]))
            x2_disp, y2_disp = int(x2 * (width / img.shape[1])), int(y2 * (height / img.shape[0]))

            cls = int(box.cls[0])
            print("Class name -->", classNames[cls])

            confidence = math.ceil((box.conf[0] * 100)) / 100
            print("Confidence --->", confidence)

            bounding_box_info = {
                'class_name': classNames[cls],
                'confidence': confidence,
                'coordinates': {
                    'x1': x1_disp,
                    'y1': y1_disp,
                    'x2': x2_disp,
                    'y2': y2_disp
                }
            }

            bounding_boxes.append(bounding_box_info)

    return bounding_boxes


if __name__ == '__main__':
    if sys.argv[1] == '--develop':
        # if you get an error like this:
        # 'python3' is not recognized as an internal or external command
        # or something along those open package.json and change the start script from this:
        # "start:eel": "python3 index.py --develop"
        # to any of these:
        # "start:eel": "python index.py --develop"
        # "start:eel": "python2 index.py --develop"
        # "start:eel": "py index.py --develop"
      
        eel.init('client')
        print("Running in development mode")
        eel.start({"port": 3000}, host="localhost", port=8888, mode='chrome-app', cmdline_args=['--start-fullscreen', '--app'])
    else:
        eel.init('build')
        eel.start('index.html')