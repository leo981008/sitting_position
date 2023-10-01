import multi_rabboni
import numpy as np
import json
import time
import pymysql.cursors

MAC_ADDRS = [
    'D4:E3:66:0D:55:3A',
    'DC:C6:A4:98:2A:E1', 
]

with open('gyro_avg_offset.json', 'r') as openfile:
    json_object = json.load(openfile)

avg_offset = np.zeros((len(MAC_ADDRS), 3))
                      
for i, mac in enumerate(MAC_ADDRS):
    if mac not in json_object.keys():
        print(f"WARNING: {mac} is not calibrated. Run calibrate.py to calibrate.")
        
    else:
        avg_offset[i] = np.array(json_object[mac])
        

connection = pymysql.connect(host='127.0.0.1',
                             user='situser',
                             password='sit',
                             database='sitdb',
                             cursorclass=pymysql.cursors.DictCursor)

cursor = connection.cursor()

def handle_gyro_data(data):
    global connection, cursor
    
    data = ((data - avg_offset) * 100).astype(np.int64)
    query = f"insert pointdb value(0,{data[0][1]},{data[1][1]},0,0,0,{int(time.time())})"
    cursor.execute(query)
    connection.commit()

    print(data)
            
multi_rabboni.MultiRabboniHandler(MAC_ADDRS, on_data_submitted=handle_gyro_data)
