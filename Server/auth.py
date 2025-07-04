#!/usr/bin/env python

#-----------------------------------------------------------------------
# auth.py
# Authors: Alex Halderman, Scott Karlin, Brian Kernighan, Bob Dondero,
#          and Joshua Lau '26
#-----------------------------------------------------------------------

import urllib.request
import urllib.parse
import re
import json
import flask

from top import app

#-----------------------------------------------------------------------

_CAS_URL = 'https://fed.princeton.edu/cas/'

#-----------------------------------------------------------------------

# Return url after stripping out the "ticket" parameter that was
# added by the CAS server.

def strip_ticket(url):
    if url is None:
        return "something is badly wrong"
    url = re.sub(r'ticket=[^&]*&?', '', url)
    url = re.sub(r'\?&?$|&$', '', url)
    return url

#-----------------------------------------------------------------------

# Validate a login ticket by contacting the CAS server. If
# valid, return the user's user_info; otherwise, return None.

def validate(ticket):
    val_url = (_CAS_URL + "validate"
        + '?service='
        + urllib.parse.quote(strip_ticket(flask.request.url))
        + '&ticket='
        + urllib.parse.quote(ticket)
        + '&format=json')
    with urllib.request.urlopen(val_url) as flo:
        result = json.loads(flo.read().decode('utf-8'))

    if (not result) or ('serviceResponse' not in result):
        return None

    service_response = result['serviceResponse']

    if 'authenticationSuccess' in service_response:
        user_info = service_response['authenticationSuccess']
        return user_info

    if 'authenticationFailure' in service_response:
        print('CAS authentication failure:', service_response)
        return None

    print('Unexpected CAS response:', service_response)
    return None

#-----------------------------------------------------------------------

# Authenticate the user, and return the user's info.
# Do not return unless the user is successfully authenticated.

def authenticate():

    # If the user_info is in the session, then the user was
    # authenticated previously.  So return the user_info.
    if 'user_info' in flask.session:
        user_info = flask.session.get('user_info')
        return user_info

    # If the request does not contain a login ticket, then redirect
    # the browser to the login page to get one.
    ticket = flask.request.args.get('ticket')
    if ticket is None:
        login_url = (_CAS_URL + 'login?service=' +
            urllib.parse.quote(flask.request.url))
        flask.abort(flask.redirect(login_url))

    # If the login ticket is invalid, then redirect the browser
    # to the login page to get a new one.
    user_info = validate(ticket)
    if user_info is None:
        login_url = (_CAS_URL + 'login?service='
            + urllib.parse.quote(strip_ticket(flask.request.url)))
        flask.abort(flask.redirect(login_url))

    # The user is authenticated, so store the user_info in
    # the session and return it.
    flask.session['user_info'] = user_info
    return user_info

#-----------------------------------------------------------------------

def is_authenticated():

    return 'user_info' in flask.session

#-----------------------------------------------------------------------

@app.route('/logoutapp', methods=['GET'])
def logoutapp():

    # Log out of the application.
    flask.session.clear()
    html_code = '''
        <!DOCTYPE html>
        <html>
           <head>
              <title>TigerPool</title>
              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
              <style>
                body {
                    background-color: #AA92DD;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }
                .container {
                    text-align: center;
                    padding: 2rem;
                }
                h2 {
                    font-size: 2rem;
                    margin-bottom: 1.5rem;
                    font-weight: 500;
                }
                a {
                    display: inline-block;
                    background-color: #6851a4;
                    color: white;
                    text-decoration: none;
                    padding: 8px 20px;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 4px rgba(104, 81, 164, 0.2);
                }
                a:hover {
                    background-color: #7a62b8;
                    box-shadow: 0 4px 8px rgba(104, 81, 164, 0.3);
                    color: white;
                }
              </style>
           </head>
           <body>
              <div class="container">
                <h2>You are logged out of TigerPool</h2>
                <a href="/index">Login Again</a>
              </div>
           </body>
        </html>'''
    response = flask.make_response(html_code)
    return response

#-----------------------------------------------------------------------

@app.route('/logoutcas', methods=['GET'])
def logoutcas():

    # Log out of the CAS session, and then the application.
    logout_url = (_CAS_URL + 'logout?service='
        + urllib.parse.quote(
            re.sub('logoutcas', 'logoutapp', flask.request.url)))
    flask.abort(flask.redirect(logout_url))
