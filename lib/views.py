import os
from flask import Flask, session, redirect, url_for, escape, request, render_template, Response, send_from_directory
from lib import app
import json
from flask.ext.classy import FlaskView,route
import nltk
from nltk.corpus import wordnet as wn
from pymongo import MongoClient, ASCENDING, DESCENDING
from PIL import Image
import json
import csv
import base64, urllib,io,numpy as np


client = MongoClient('mongodb://localhost:27017')

db = client.ImageRetrieval
col1 = db.image



@app.route('/')
def route_display():
    return render_template('index.html')


class HelloView(FlaskView):
    def __init__(self):
        pass

    @route('/image', methods=['GET','POST'])
    def image_save(self):

        image_index = json.loads(request.form['image'])

        print image_index

        temp_array = col1.find({"index":image_index})

        for t in temp_array:
            image_url = t['photo_file_url']


        print image_url

        image = io.BytesIO(urllib.urlopen(image_url).read())
        print image
        image = Image.open(image)
        print image
        image = image.resize((100,100), Image.ANTIALIAS)
        print image

        image.save ( 'lib/static/image/' + str(image_index) + '.jpg' , 'JPEG')

        return "hi"

    @route('/data', methods=['GET','POST'])
    def get_data(self):

        x = json.loads(request.form['query_num']) - 1

        temp_array = []

        for i in range(10):
            temp_array.append(col1.find({"index":10*x+i+1}))

        array = []

        for count,t in enumerate(temp_array):
            array.append([])
            for a in t:
                del a['_id']
                array[count].append(a)


        print temp_array

        return json.dumps(array)


    @route('/hoge', methods=['GET','POST'])
    def index(self):

        x = json.loads(request.form['query'])

        for i in range(len(x)):

            a = col1.count() + 1
            x[i]['index'] = a

            col1.update({'photo_file_url':x[i]['photo_file_url']},x[i],upsert=True)
            #if i > 10:
            #    break

        #image = urllib.urlopen(x[0]['photo_file_url'])
        #image_64 = base64.encodestring(image.read())

        #temp = io.BytesIO(image.read())

        #print np.array(Image.open(temp))

        return "hello world"


HelloView.register(app)