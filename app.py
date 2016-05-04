from flask import Flask, render_template, Response, request
from flask_restful import reqparse, abort, Api, Resource
import os, datetime

import psutil, json, logging, time
from logging.handlers import TimedRotatingFileHandler

app = Flask(__name__)
api = Api(app)

class Snippets(Resource):
    def post(self):
        try:

            parser = reqparse.RequestParser()
            parser.add_argument('namespace', type=str, required=True)
            parser.add_argument('text', type=str, required=True)
            parser.add_argument('task')
            args = parser.parse_args()

            ns = args['namespace']
            text = args['text']
            clientip = unicode(request.remote_addr)
            dtime = datetime.datetime.now()
            dtstring =  dtime.strftime("%Y-%m-%d")

            file = datadir + "/" + "messages-" + dtstring + ".log" 
            entry = unicode(dtime) + '  ' + clientip + '  "' + ns + '"  "' + text + '"'
            f = open(file,'a')
            f.write(entry + '\n')
            f.close()

            counter = counter + 1
            return entry, 201
        except TypeError:
            return "Internal Server Error", 500
        except NameError:
            return "Internal Server Error", 500


class Snippets(Resource):
    def get(self):

            return json.dumps(flist), 200
        else:
            return json.dumps([]), 200

   

@app.route('/', methods=['GET'])
def show_homepage():
    return render_template("index.html")


api.add_resource(Snippet, '/Snippet')
api.add_resource(Snippets, '/snippets')


if __name__ == '__main__':
    app.run(threaded=True, host='0.0.0.0', debug=True)