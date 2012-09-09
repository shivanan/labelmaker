#!/usr/bin/env python
import sys
from flask import Flask,render_template,g,abort,request,send_file
import json
import makelabels
#from flask.ext.sqlalchemy import SQLAlchemy

DEBUG = True
STATIC_DIR = 'public'

app = Flask(__name__)

@app.route('/makelabel')
def mkl():
	return render_template('makelabel.html')

@app.route('/render',methods=['POST'])
def render():
	lbl_json = request.form['qlabel']
	# raise Exception(str(('json',lbl_json,request.form)))
	# TODO: Error check this
	lbl_obj = json.loads(lbl_json)
	w = lbl_obj['width']*72
	h = lbl_obj['height']*72
	label = makelabels.Label(pagesize=(w,h))
	for obj in lbl_obj['objects']:
		txt = obj['text']
		x = obj['x']*72
		y = obj['y']*72
		w = obj['width']*72
		h = obj['height']*72
		label.drawText(txt,x,y,w,h)

	data_stream = label.save()
	return send_file(data_stream,'application/pdf')
def main():
	app.run(debug=DEBUG,host='0.0.0.0')
if __name__ == '__main__': main()
