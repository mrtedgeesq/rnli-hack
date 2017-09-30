'''
Created on 30 Sep 2017

@author: dusted-ipro
'''

import os
import sys
import json
from random import randint
import requests
from time import sleep

from flask import Flask, render_template, jsonify, g, request, Response, abort
from flask_cors import CORS, cross_origin

EA_API = 'https://environment.data.gov.uk/flood-monitoring/id/stations?'
#Global Search distance for stations
DISTKM = 20

#Fake Data to save API CAlls
FAKE = {"lat": 50.713642, "status": "success", "alt": 10.5, "lon": -1.989745, "stations": [{"riverLabel": "Walford Mill", "name": "River Allen", "value": 0.148, "dateTime": "2017-09-30T04:00:00Z"}, {"riverLabel": "Bournemouth", "name": "Tide", "value": 0.248, "dateTime": "2017-09-30T10:45:00Z"}, {"riverLabel": "Wareham", "name": "Dorset Coast", "value": 0.22, "dateTime": "2017-09-30T04:00:00Z"}, {"riverLabel": "Blandford", "name": "River Stour", "value": 0.131, "dateTime": "2017-09-30T04:00:00Z"}, {"riverLabel": "Poole Harbour", "name": "Dorset Coast", "value": 0.619, "dateTime": "2017-09-30T09:00:00Z"}, {"riverLabel": "Swanage Prospect Farm Swan Brook", "name": "Swan Brook", "value": 0.063, "dateTime": "2017-09-30T04:00:00Z"}, {"riverLabel": "Briantspuddle", "name": "River Piddle", "value": 0.197, "dateTime": "2017-09-30T04:00:00Z"}, {"riverLabel": "Throop", "name": "River Stour", "value": 0.418, "dateTime": "2017-09-30T09:00:00Z"}, {"riverLabel": "Christchurch", "name": "Christchurch Coast", "value": 0.278, "dateTime": "2017-09-30T04:00:00Z"}, {"riverLabel": "Ensbury", "name": "River Stour", "value": 0.552, "dateTime": "2017-09-30T04:00:00Z"}, {"riverLabel": "East Stoke", "name": "River Frome", "value": 0.674, "dateTime": "2017-09-30T09:00:00Z"}, {"riverLabel": "Wimborne", "name": "River Stour", "value": 0.487, "dateTime": "2017-09-30T04:00:00Z"}, {"riverLabel": "Ringwood Riverside Terrace", "name": "Bickerly Mill Stream", "value": 0.655, "dateTime": "2017-09-30T04:00:00Z"}, {"riverLabel": "Moyles Court", "name": "Docken's Water", "value": 0.141, "dateTime": "2017-09-30T04:00:00Z"}, {"riverLabel": "Hurn Court", "name": "Moors River", "value": 0.285, "dateTime": "2017-09-30T04:00:00Z"}, {"riverLabel": "Swanage King Georges Field St Marys Church", "name": "Swan Brook", "value": 0.002, "dateTime": "2017-09-30T04:00:00Z"}, {"riverLabel": "Sturminster Marshall Maggs Bridge", "name": "North Winterbourne", "value": 0.159, "dateTime": "2017-09-30T06:00:00Z"}, {"riverLabel": "Iford Bridge", "name": "River Stour", "value": 0.443, "dateTime": "2017-09-30T10:30:00Z"}, {"riverLabel": "Knapp Mill", "name": "River Avon", "value": 0.377, "dateTime": "2017-09-30T09:00:00Z"}, {"riverLabel": "Loverley Farm", "name": "River Allen", "value": 0.483, "dateTime": "2017-09-30T04:00:00Z"}]}
GEN_FAKE = True

# Ensure paths then use . package notation and __init__ files.
this_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if this_dir not in sys.path:
    sys.path.append(this_dir)


# Flask App configuration
app = Flask(__name__)
app.debug = True
app.config['SECRET_KEY'] = ''
app.name = 'rnli_pi_app'
CORS(app)

###GPS Poller
def get_gps():
    '''
    Poll and return GPS data from GPSD
    '''
    out = {'lat':50.713642, 'lon':-1.989745, 'alt':10.5}
    return out


def get_river_data(dist, lat, lon, alt):
    '''
    Get the current river levels for stations within X dist of lat/lon
    '''
    if GEN_FAKE == True:
        return FAKE
    out = {'lat':lat, 'lon':lon,
           'alt':alt, 'stations':[],
           'status':''}
    station = {'catchment':'', 'label':'', 'level':''}

    url = '{}lat={}&long={}&dist={}'.format(EA_API, lat, lon, dist)
    r = requests.get(url)
    print url
    if r.status_code == 200:
        data = r.json()
        if len(data['items']) != 0:
            for station in data['items']:
                try:
                    for m in station['measures']:
                        if m['parameter'] == 'level':
                            #Get level info
                            r_measure = requests.get(m['@id'])
                            if r.status_code == 200:
                                data_measures = r_measure.json()
                                try:
                                    out['stations'].append({'name':station['riverName'],
                                                            'riverLabel':station['label'],
                                                            'dateTime':data_measures['items']['latestReading']['dateTime'],
                                                            'value':data_measures['items']['latestReading']['value']})
                                except:
                                    pass
                                sleep(0.1)
                except KeyError:
                    print data_measures.keys()
            out['status'] = 'success'
        else:
            out['status'] = 'No stations within given range'

    print url

    return out




@app.route('/suggest')
def suggestPath():
    """ normal http request to a serve up the page """
    return render_template('index_suggest.html')


@app.route('/request_assist', methods=['POST'])
def request_assist():
    return Response(json.dumps({"test":"ping"}), mimetype='application/json')


@app.route('/river_data')
def river_data():
    '''
    River Data endpoint
    '''
    #Get the Current GPS
    coords = get_gps()

    #Get the river levels
    measures = get_river_data(DISTKM, coords['lat'],
                              coords['lon'], coords['alt'])

    #Combine and send back
    return Response(json.dumps(measures), mimetype='application/json')



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)






