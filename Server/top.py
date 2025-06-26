#!/usr/bin/env python

#-----------------------------------------------------------------------
# top.py
# Author: Bob Dondero
#-----------------------------------------------------------------------

import os
import flask
import dotenv

app = flask.Flask(__name__)

dotenv.load_dotenv()
app.secret_key = os.environ['APP_SECRET_KEY']
