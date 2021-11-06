import tensorflow as tf
#tf.enable_eager_execution()
import numpy as np
import os

import sys

import requests
import json
import base64
import datetime

from collections import defaultdict

from matplotlib import pyplot as plt
from PIL import Image
import cv2
import pathlib 


from object_detection.utils import ops as utils_ops
from object_detection.utils import label_map_util
from object_detection.utils import visualization_utils as vis_util

root_dir = os.getcwd()
# patch tf1 into `utils.ops`
utils_ops.tf = tf.compat.v1

# Patch the location of gfile
tf.gfile = tf.io.gfile


# List of the strings that is used to add correct label for each box.
#PATH_TO_LABELS = 'annotations/worker_helmet_label_map.pbtxt'
PATH_TO_LABELS = 'annotations/label_map.pbtxt'
category_index = label_map_util.create_category_index_from_labelmap(PATH_TO_LABELS, use_display_name=True)
print(category_index)

#fine_tuned_model = "worker_helmet_pretrained_model"
fine_tuned_model = "fine_tuned_model"

model_dir = pathlib.Path(fine_tuned_model)/"saved_model"
print(model_dir)
model = tf.compat.v1.saved_model.load_v2(str(model_dir))

def run_inference_for_single_image(model, image):
  image = np.asarray(image)
  # The input needs to be a tensor, convert it using `tf.convert_to_tensor`.
  input_tensor = tf.convert_to_tensor(image)
  # The model expects a batch of images, so add an axis with `tf.newaxis`.
  input_tensor = input_tensor[tf.newaxis,...]

  # Run inference
  model_fn = model.signatures['serving_default']
  output_dict = model_fn(input_tensor)

  # All outputs are batches tensors.
  # Convert to numpy arrays, and take index [0] to remove the batch dimension.
  # We're only interested in the first num_detections.
  num_detections = int(output_dict.pop('num_detections'))
  output_dict = {key:value[0, :num_detections].numpy() 
                for key,value in output_dict.items()}
  output_dict['num_detections'] = num_detections

  # detection_classes should be ints.
  output_dict['detection_classes'] = output_dict['detection_classes'].astype(np.int64)
  
  # Handle models with masks:
  if 'detection_masks' in output_dict:
    # Reframe the the bbox mask to the image size.
    detection_masks_reframed = utils_ops.reframe_box_masks_to_image_masks(
              output_dict['detection_masks'], output_dict['detection_boxes'],
              image.shape[0], image.shape[1])      
    detection_masks_reframed = tf.cast(detection_masks_reframed > 0.5,
                                      tf.uint8)
    output_dict['detection_masks_reframed'] = detection_masks_reframed.numpy()
    
  return output_dict

# def show_inference(model, image_path):
#     # the array based representation of the image will be used later in order to prepare the
#     # result image with boxes and labels on it.
#     image_np = np.array(Image.open(image_path))
#     # image_np = cv2.resize(image_np,(300,300))
#     # Actual detection.
#     output_dict = run_inference_for_single_image(model, image_np)
#     # Visualization of the results of a detection.
#     vis_util.visualize_boxes_and_labels_on_image_array(
#     image_np,
#     output_dict['detection_boxes'],
#     output_dict['detection_classes'],
#     output_dict['detection_scores'],
#     category_index,
#     instance_masks=output_dict.get('detection_masks_reframed', None),
#     use_normalized_coordinates=True,
#     line_thickness=8)
    # return image_np
    

# i = 0
# for image_path in os.listdir(os.path.join(root_dir,'test_folder')):
#     image_np = show_inference(model, os.path.join(root_dir,'test_folder',image_path))
#     i += 1
#     cv2.imwrite(os.path.join(root_dir,'output_folder','output_image' + str(i) + '.jpg'),image_np)

# print(i)

#cap = cv2.VideoCapture(0)
cap = cv2.VideoCapture("../../../imagens/WIN_20211031_14_57_28_Pro.mp4")
# cap.open("http://192.168.1.4:8080/video")

detect_fames = 0
sended = False

to_update = {}




def Insert(frame_rec):
  global to_update
  #urlpost = 'https://safety-control.vercel.app/api/servicos/Control/controlService'
  urlpost = 'http://localhost:3000/api/servicos/Control/controlService'
  retval_rec, buffer_rec = cv2.imencode('.jpg', frame_rec)
  frame_converted_i = base64.b64encode(buffer_rec)
  #frame_converted_i = base64.b64encode(frame_rec)
  #frame_co = base64.b64decode(frame_converted_i)
  #cv2.imshow('2outputup',frame_rec)
  #cv2.imshow('outputup',frame_co)
  #cv2.imwrite('frame{:d}.jpg'.format(1), frame_rec)
  control_i = { "Control" : {
                "id" : 0,
                "epi_id"       : 1,       
                "description"   : "detectado sem capacete", 
                "start_image"   : str(frame_converted_i),
                "end_date": "2012-04-23T18:25:43.511Z"
              } }
  #print(print(json.dumps({"c": 0, "b": 0, "a": 0}, sort_keys=True))
  #arquivo = open("teste.txt", 'r+')
  #retval, buffer = cv2.imencode('.jpg', frame)
  #jpg_as_text = base64.b64encode(buffer)
  #arquivo.write(str(jpg_as_text)) #consegue editar
  #arquivo.close()
  
  response_post = requests.post(urlpost, data=json.dumps(control_i, sort_keys=True), headers={"Content-Type": "application/json"})
  
  print(response_post.status_code)     
  if response_post.status_code == 200:
    to_update = response_post.json()
    print(response_post.json())     
    return True

def Update(frame_rec_u):
  global to_update
 # urlput = 'https://safety-control.vercel.app/api/servicos/Control/controlService'
  urlput = 'http://localhost:3000/api/servicos/Control/controlService'
  retval, buffer_rec_u = cv2.imencode('.jpg', frame_rec_u)
  frame_converted_u = base64.b64encode(buffer_rec_u)
  #frame_converted_u = base64.b64encode(frame_rec_u)
  print(to_update) 
  print(to_update["id"]) 
  control_u = { "Control" : {
                'id' : to_update["id"],
                'epi_id'        : 1,      
                'description'   : "detectado retornou capacete", 
                'end_date'      : str(datetime.datetime.today()),
                'end_image'   : str(frame_converted_u)
              }}   
  response_put = requests.put(urlput, data=json.dumps(control_u, sort_keys=True), headers={"Content-Type": "application/json"})
  print(response_put.status_code)     
  if response_put.status_code == 200:
    print(response_put.json()) 
    print(response_put)             
    return False

while(cap.isOpened()):
  try:
      
# while(True):
    # Capture frame-by-frame
      ret,frame = cap.read()
      image_np = np.array(frame)
      output_dict = run_inference_for_single_image(model,image_np)

      boxes_itens = vis_util.visualize_boxes_and_labels_on_image_array(
        frame,
        output_dict['detection_boxes'],
        output_dict['detection_classes'],
        output_dict['detection_scores'],
        category_index,
        instance_masks=output_dict.get('detection_masks_reframed', None),
        use_normalized_coordinates=True,
        line_thickness=8)
      cv2.namedWindow("output", cv2.WINDOW_NORMAL)
      cv2.imshow('output',frame)

      if boxes_itens != [[]]:
        if str(boxes_itens[0][0][0]) == str('No_Helmet'):
          if int(boxes_itens[0][0][1]) > int(75):
            detect_fames = int(detect_fames) + 1
            if(int(detect_fames) == 5):        
              sended = Insert(frame)
          else:
            detect_fames = 0
            if(sended):     
              sended = Update(frame)    
        else:
          detect_fames = 0
          if(sended):   
              sended = Update(frame) 
      else:
          detect_fames = 0
          if(sended):       
            sended = Update(frame)    

      if cv2.waitKey(1) & 0xFF == ord('q'):
          break
  except Exception as e:
    print(boxes_itens)
    print(e)
    pass
    

# When everything done, release the capture
cap.release()
cv2.destroyAllWindows()
    
