#!/usr/bin/env python

#-----------------------------------------------------------------------
# tigerpool.py
# Author: TigerPool
#-----------------------------------------------------------------------

import os
import sys
import time
import json
import threading
import flask
import auth
import database
from datetime import datetime, timezone, timedelta
import math
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from top import app
sys.path.append(os.path.abspath('..'))

DB_LOCK = threading.RLock()

FULL = 0
JOINABLE = 1
LEAVABLE = 2
DELETABLE = 3

#-----------------------------------------------------------------------

def get_ampm():
    if time.strftime('%p') == "AM":
        return 'morning'
    return 'afternoon'

def get_current_time():
    return time.asctime(time.localtime())

#-----------------------------------------------------------------------

def in_region(center_lat, center_lng, target_lat, target_lng, rad):
    """
    Calculate the bounding box coordinates for a 5-mile radius around the given center.
    Determines if the target coordinates are within that bounding box.
    """

    # Convert input radius in miles to degrees
    lat_degree = (rad / 69) / 2
    lon_degree = (rad / (69 * abs(math.cos(math.radians(center_lat))))) / 2

    # print("lat_degree:", lat_degree)
    # print("lon_degree:", lon_degree)
    
    min_lat = center_lat - lat_degree
    max_lat = center_lat + lat_degree
    min_lng = center_lng - lon_degree
    max_lng = center_lng + lon_degree
    # print("min_lat:",min_lat)
    # print("max_lat:",max_lat)
    # print("min_lng:",min_lng)
    # print("max_lng:",max_lng)

    if (min_lat < target_lat and max_lat > target_lat and min_lng < target_lng and max_lng > target_lng):
        return True
    
    return False

#-----------------------------------------------------------------------

@app.route('/', methods=['GET'])
@app.route('/index', methods=['GET'])
def index():

    return flask.send_file('../Frontend/index.html')

#-----------------------------------------------------------------------
@app.route('/getusersinride', methods=['GET'])   
def get_users_in_ride_api():
    user_info = auth.authenticate()
    ride_id = user_info['user']

    ride_id = flask.request.args.get("ride_id")
    users = database.get_users_in_ride(ride_id)

    creator_id = database.get_creator_id(ride_id)
    # print(creator_id)

    rides_data = [
        {"user": user[0]} for user in users
    ]

    for ride in rides_data:
        if ride['user']==creator_id:
            ride['creator'] = "*"
        else: 
            ride['creator'] = ""

    return flask.jsonify(rides_data)  # Return JSON

#-----------------------------------------------------------------------

@app.route('/home', methods=['GET'])
def home():
    auth.authenticate()
    return flask.send_file('../Frontend/home.html')

#-----------------------------------------------------------------------

@app.route('/getusername', methods=['GET'])
def get_username():
    user_info = auth.authenticate()
    username = user_info['user']
    return username

#-----------------------------------------------------------------------

@app.route('/profile', methods=['GET'])
def profile():
    auth.authenticate()
    return flask.send_file('../Frontend/profile.html')

#-----------------------------------------------------------------------
@app.route('/rides', methods=['GET'])   
def get_rides_api():
    user_info = auth.authenticate()

    # Get filters from query parameters
    pickup_location = flask.request.args.get("pickup_location")
    pickup_lat = flask.request.args.get("pickup_lat")
    pickup_lng = flask.request.args.get("pickup_lng")
    pickup_rad = flask.request.args.get("pickup_rad")
    ride_destination = flask.request.args.get("ride_destination")
    dest_lat = flask.request.args.get("dest_lat")
    dest_lng = flask.request.args.get("dest_lng")
    dest_rad = flask.request.args.get("dest_rad")
    ride_date = flask.request.args.get("ride_date")
    time_from = flask.request.args.get("time_from")
    time_to = flask.request.args.get("time_to")

    # Pass filters to DB layer
    rides = database.get_rides(pickup_location, ride_destination, ride_date, time_from, time_to)
    rides_data = []
    now = datetime.now(tz=timezone(-timedelta(hours=4)))
    
    for ride in rides:
        # print("Current Ride", ride)
        ride_datetime = datetime.strptime(f"{ride[3]} {ride[2]} -0400", "%Y-%m-%d %H:%M:%S %z")
        if ride_datetime <= now:
             continue  # Skip future rides

        if pickup_lat is not None and pickup_lng is not None:
            if float(pickup_lat) != 0 and float(pickup_lng) != 0:
                # print(float(ride[7]))
                # print(float(ride[8]))
                if not in_region(float(pickup_lat), float(pickup_lng), float(ride[7]), float(ride[8]), float(pickup_rad)):
                    continue
        if dest_lat is not None and dest_lng is not None:
            if float(dest_lat) != 0 and float(dest_lng) != 0:
                if not in_region(float(dest_lat), float(dest_lng), float(ride[10]), float(ride[11]), float(dest_rad)):
                    continue

        button_stat = FULL
        in_ride = database.check_in_ride(ride[0], user_info["user"])
        if not in_ride and ride[4] < ride[5]:
            button_stat = JOINABLE
        if in_ride and ride[1] != user_info["user"]:
            button_stat = LEAVABLE
        if in_ride and ride[1] == user_info["user"]:
            button_stat = DELETABLE

        rides_data.append({
            "ride_id": ride[0],
            "ride_time": str(ride[2]),
            "ride_date": str(ride[3]),
            "ride_occupants":ride[4],
            "ride_size": ride[5],
            "pickup_location":ride[6],
            "ride_destination": ride[9],
            "in_ride":in_ride,
            "button_stat":button_stat
        })
    return flask.jsonify(rides_data)  # Return JSON

#-----------------------------------------------------------------------
@app.route('/mycurrentrides', methods=['GET'])   
def get_current_rides():
    user_info = auth.authenticate()
    username = user_info['user']

    now = datetime.now(tz=timezone(-timedelta(hours=4)))
    # print(now)
    rides = database.get_my_rides(username)
    rides_data = []

    
    for ride in rides:
        ride_datetime = datetime.strptime(f"{ride[3]} {ride[2]} -0400", "%Y-%m-%d %H:%M:%S %z")
        # print(now)
        # print(ride_datetime)

        button_stat = FULL
        in_ride = database.check_in_ride(ride[0], user_info["user"])
        if not in_ride and ride[4] < ride[5]:
            button_stat = JOINABLE
        if in_ride and ride[1] != user_info["user"]:
            button_stat = LEAVABLE
        if in_ride and ride[1] == user_info["user"]:
            button_stat = DELETABLE

        if ride_datetime <= now or not in_ride:
             continue  # Skip future rides
        rides_data.append({
            "ride_id": ride[0],
            "ride_time": str(ride[2]),
            "ride_date": str(ride[3]),
            "ride_occupants":ride[4],
            "ride_size": ride[5],
            "pickup_location":ride[6],
            "ride_destination": ride[9],
            "in_ride":in_ride,
            "button_stat":button_stat
        })
        # print(f"Ride datetime: {ride_datetime}, Now: {now}, Included: {ride_datetime > now}")

    return flask.jsonify(rides_data)  # Return JSON



#-----------------------------------------------------------------------
@app.route('/mypreviousrides', methods=['GET'])   
def get_previous_rides_api():
    user_info = auth.authenticate()
    username = user_info['user']

    now = datetime.now(tz=timezone(-timedelta(hours=4)))
    # print(now)
    rides = database.get_my_rides(username)
    rides_data = []

    
    for ride in rides:
        ride_datetime = datetime.strptime(f"{ride[3]} {ride[2]} -0400", "%Y-%m-%d %H:%M:%S %z")
        # print(now)
        # print(ride_datetime)

        button_stat = FULL
        in_ride = database.check_in_ride(ride[0], user_info["user"])
        if not in_ride and ride[4] < ride[5]:
            button_stat = JOINABLE
        if in_ride and ride[1] != user_info["user"]:
            button_stat = LEAVABLE
        if in_ride and ride[1] == user_info["user"]:
            button_stat = DELETABLE

        if ride_datetime >= now or not in_ride:
             continue  # Skip future rides
        rides_data.append({
            "ride_id": ride[0],
            "ride_time": str(ride[2]),
            "ride_date": str(ride[3]),
            "ride_occupants":ride[4],
            "ride_size": ride[5],
            "pickup_location":ride[6],
            "ride_destination": ride[9],
            "in_ride":in_ride,
            "button_stat":button_stat
        })
        # print(f"Ride datetime: {ride_datetime}, Now: {now}, Included: {ride_datetime < now}")

    return flask.jsonify(rides_data)  # Return JSON

#-----------------------------------------------------------------------

@app.route('/addride', methods=['GET'])
def display_add_ride_page():
    auth.authenticate()
    return flask.send_file('../Frontend/add_ride.html')

#-----------------------------------------------------------------------

@app.route('/createdride', methods=["POST"])
def created_ride_api():
    user_info = auth.authenticate()
    inputs = flask.request.args.get("inputs")
    ride_data = json.loads(inputs)
    # print(ride_data)
    ride_data.update({"username":user_info["user"]})
    database.add_ride(ride_data)

    return "Success"

#-----------------------------------------------------------------------

@app.route('/joinride', methods=["POST"])
def join_ride_api():
    user_info = auth.authenticate()
    ride_id = flask.request.args.get("ride_id")
    creator_id = database.get_creator_id(ride_id)
    with DB_LOCK:
        out = database.join_ride(user_info["user"], ride_id)
    print("Join Confirmation:", out) 
    ride = database.get_ride_from_id(ride_id)
    # print(ride)
    message = Mail(
        from_email='cs-tigerpool@princeton.edu',
        to_emails=creator_id+'@princeton.edu',
        subject='User Joined Your ride',
        html_content="This email is being sent to notify you that "+user_info["user"] +" has opted to join your ride from <strong>"+ ride[0][6] +"</strong> to <strong>" + ride[0][9] + "</strong> on " + ride[0][3].strftime("%m/%d/%Y") + ". Please visit <a href='https://tigerpool.onrender.com'>TigerPool</a> for more information."
        )
    try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        response = sg.send(message)
        # print(response.status_code)
        # print(response.body)
        # print(response.headers)
    except Exception as e:
        print(e)
    return flask.send_file('../Frontend/home.html')

#-----------------------------------------------------------------------

@app.route('/leaveride', methods=["POST"])
def leave_ride_api():
    user_info = auth.authenticate()
    ride_id = flask.request.args.get("ride_id")
    creator_id = database.get_creator_id(ride_id)
    ride = database.get_ride_from_id(ride_id)
    with DB_LOCK:
        out = database.leave_ride(user_info["user"], ride_id)
    print("Leave Confirmation:", out)
    message = Mail(
        from_email='cs-tigerpool@princeton.edu',
        to_emails=creator_id+'@princeton.edu',
        subject='User Left Your ride',
        html_content="This email is being sent to notify you that "+user_info["user"] +" has opted to leave your ride from <strong>"+ ride[0][6] +"</strong> to <strong>" + ride[0][9] + "</strong> on " + ride[0][3].strftime("%m/%d/%Y") + ". Please visit <a href='https://tigerpool.onrender.com'>TigerPool</a> for more information.</strong>"
    )
    try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        response = sg.send(message)
        # print(response.status_code)
        # print(response.body)
        # print(response.headers)
    except Exception as e:
        print(e)

    return flask.send_file('../Frontend/home.html')

#-----------------------------------------------------------------------

@app.route('/delride', methods=["POST"])
def del_ride_api():
    user_info = auth.authenticate()
    ride_id = flask.request.args.get("ride_id")

    users = database.get_users_in_ride(ride_id)
    to_emails = [user[0]+"@princeton.edu" for user in users if user[0] != user_info["user"]]
    ride = database.get_ride_from_id(ride_id)

    with DB_LOCK:
        out = database.del_ride(ride_id)
    print("Delete Confirmation:", out)

   
    print(to_emails)
    print(len(to_emails))
    if (len(to_emails) > 0):
        for email in to_emails:
            message = Mail(
                from_email='cs-tigerpool@princeton.edu',
                to_emails=email,
                subject='User Deleted Your ride',
                html_content="This email is being sent to notify you that "+user_info["user"] +" has opted to DELETE your ride from <strong>"+ ride[0][6] +"</strong> to <strong>" + ride[0][9] + "</strong> on " + ride[0][3].strftime("%m/%d/%Y") + ". Please visit <a href='https://tigerpool.onrender.com'>TigerPool</a> for more information.")
            try:
                sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
                response = sg.send(message)
                print(response.status_code)
                print(response.body)
                print(response.headers)
            except Exception as e:
                print(e)
    return flask.send_file('../Frontend/home.html')
