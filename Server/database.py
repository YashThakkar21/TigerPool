#!/usr/bin/env python

#-----------------------------------------------------------------------
# database.py
# Author: TigerPool
#-----------------------------------------------------------------------

import flask
import os
import psycopg2
from dotenv import load_dotenv
import random 

load_dotenv()

url = os.getenv("DATABASE_URL")
connection = psycopg2.connect(url)

def get_rides(pickup_location=None, ride_destination=None, ride_date=None, time_from=None, time_to=None):
    with connection:
        with connection.cursor() as cursor:
            query = "SELECT * FROM ride WHERE TRUE"
            params = []
            # if pickup_location:
            #     query += " AND pickup ILIKE %s"
            #     params.append(f"%{pickup_location}%")
            # if ride_destination:
            #     query += " AND destination ILIKE %s"
            #     params.append(f"%{ride_destination}%")
            if ride_date:
                query += " AND ride_date = %s"
                params.append(ride_date)
            if time_from != None and time_from != "":
                query += " AND ride_time > %s"
                params.append(time_from)
            if time_to != None and time_to != "":
                query += " AND ride_time < %s"
                params.append(time_to)

            query += ";"

            # print(query)
            # print(params)

            cursor.execute(query, params)
            return cursor.fetchall()

def get_ride_occupants(ride_id):
    with connection:
        with connection.cursor() as cursor:
            query = """SELECT ride_occupants FROM ride WHERE ride_id=%s;"""
            cursor.execute(query, [ride_id])
            rides = cursor.fetchall()
            return rides[0]

def check_in_ride(ride_id, user_id):
    with connection:
        with connection.cursor() as cursor:
            query = """SELECT user_id FROM ride_users_list WHERE ride_id=%s AND user_id ILIKE %s;"""
            cursor.execute(query, [ride_id, user_id])
            rides = cursor.fetchall()
            if len(rides) > 0:
                return True
            return False

def get_creator_id(ride_id):
     with connection:
        with connection.cursor() as cursor:
            query = """SELECT creator_id FROM ride WHERE ride_id=%s"""
            cursor.execute(query, [ride_id])
            rides = cursor.fetchall()
            # print(rides)
            return rides[0][0]

def get_my_rides(user_id):
    with connection:
        with connection.cursor() as cursor:
            query= """SELECT * FROM ride"""
            cursor.execute(query)
            rides = cursor.fetchall()
            # print(rides)
            return rides

def get_users_in_ride(ride_id):
    with connection:
        with connection.cursor() as cursor:
            query= """SELECT user_id FROM ride_users_list WHERE
            ride_id = %s;"""
            cursor.execute(query,[ride_id])
            rides = cursor.fetchall()
            return rides

def add_ride(ride_data):
    with connection:
        with connection.cursor() as cursor:
            ride_query = """INSERT INTO ride 
            (ride_id, creator_id, ride_time, ride_date, ride_occupants, ride_size,
            pickup, pickup_lat, pickup_lng, destination, dest_lat, dest_lng)
            VALUES (%s, %s, %s, %s, 1, %s, %s, %s, %s, %s, %s, %s)"""
            ride_id = hash(ride_data["username"] + str(ride_data["time"])+ str(ride_data["date"])+str(ride_data["size"]) +str(ride_data["dest"]) + str(random.random()))
            ride_id = ride_id % 1000000
            cursor.execute(ride_query, 
                [ride_id,
                 ride_data["username"],
                 ride_data["time"],
                 ride_data["date"], 
                 ride_data["size"], 
                 ride_data["pickup"],
                 ride_data["pickup_lat"],
                 ride_data["pickup_lng"],
                 ride_data["dest"],
                 ride_data["dest_lat"],
                 ride_data["dest_lng"]])
           
            user_query = """INSERT INTO ride_users_list 
            (user_id, ride_id) VALUES (%s, %s)"""
           
            cursor.execute(user_query, [ride_data["username"], ride_id])
            return True 

def join_ride(user_id, ride_id):
    with connection:
        with connection.cursor() as cursor:
            user_query = """INSERT INTO ride_users_list 
            (user_id, ride_id) VALUES (%s, %s)"""
            cursor.execute(user_query, [user_id, ride_id])
            user_query = """UPDATE ride SET
            ride_occupants=ride_occupants+1 WHERE ride_id=%s"""
            cursor.execute(user_query, [ride_id])
            return True

def leave_ride(user_id, ride_id):
    with connection:
        with connection.cursor() as cursor:
            user_query = """DELETE FROM ride_users_list WHERE
            user_id ILIKE %s AND ride_id=%s"""
            cursor.execute(user_query, [user_id, ride_id])
            user_query = """UPDATE ride SET
            ride_occupants=ride_occupants-1 WHERE ride_id=%s"""
            cursor.execute(user_query, [ride_id])
            return True

def del_ride(ride_id):
    with connection:
        with connection.cursor() as cursor:
            user_query = """DELETE FROM ride_users_list WHERE
            ride_id=%s"""
            cursor.execute(user_query, [ride_id])
            user_query = """DELETE FROM ride WHERE ride_id=%s"""
            cursor.execute(user_query, [ride_id])
            return True


def get_ride_from_id(ride_id):
    with connection:
        with connection.cursor() as cursor:
            user_query = """SELECT * FROM ride WHERE ride_id=%s"""
            cursor.execute(user_query, [ride_id])
            return cursor.fetchall()