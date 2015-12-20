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
        self.PIKA = HI(10)

    @route('/init', methods=['GET','POST'])
    def save(self):

        string_text = request.POST['query']
        f = open('ted_script2.txt', 'w')
        f.write(string_text)
        f.close()
        string_text = string_text.lower()

        tokens = nltk.word_tokenize(string_text)

        stop_sig = ["(",")","-","[","]","{","}",";",":",
                    "\\","<",">","/","@","#","$","%","^","&","*","_","~","..","...","`","``"]

        begin_end_sig = [".", ",", "!", "?"]

        morphied_tokens = []

        for token in tokens:
            if wn.morphy(token) != None and wn.morphy(token) != "be":
                morphied_tokens.append(wn.morphy(token))
            else:
                morphied_tokens.append(token)

        bigram_array = list(nltk.bigrams(tokens))
        print(bigram_array)
        print(tokens)
        j = 0
        for i in range(len(bigram_array)):
            #print(bigram_array[i][0],bigram_array[i][1])
            if bigram_array[i-j][0] in stop_sig or bigram_array[i-j][1] in stop_sig:
                #print("ni",tokens[i])
                bigram_array.pop(i-j)
                tokens.pop(i-j)
                j += 1

        print(bigram_array)
        print(tokens)

        pos = nltk.pos_tag(tokens)

        print("morphias", tokens[0], wn.synsets(tokens[0]))

        print(pos)


    @route('/hoge', methods=['GET','POST'])
    def index(self):

        x = json.loads(request.form['query'])

        col1.update({'photo_file_url':x[0]['photo_file_url']},x[0],upsert=True)

        image = urllib.urlopen(x[0]['photo_file_url'])
        #image_64 = base64.encodestring(image.read())
        temp = io.BytesIO(image.read())
        print np.array(Image.open(temp))

        #col1.insert(x[0])
        #print x[0]
        return "hello world"

class HI:
  xx = 5
  def __init__(self,x=3):
    print ("hi")
    self.x = x
    print (self.x)
    #print (xx)


  def kimi(self):
    self.x += 2
    self.xx += 2
    print(HI().xx)
    print(self.x)


HelloView.register(app)