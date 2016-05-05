from flask import Flask, render_template, Response, request
from flask_restful import reqparse, abort, Api, Resource
import psutil, json, time, os, datetime
from he import HackerEarthApi
import model

app = Flask("CodeTable")
api = Api(app)

class Snippet(Resource):
    def put(self, id):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('code', type=str, required=True)
            parser.add_argument('name', type=str, required=True)
            args = parser.parse_args()

            name = args['name']
            code = args['code']

            id = model.updateCodeSnippet(id, name, code)
            return "Updated", 200

        except RuntimeError:
            return "Internal Server Error", 500
        except NameError:
            return "Internal Server Error", 500

    def get(self, id):
        try:
            cs = model.getCodeSinppet(id)
            if cs is None:
                return "Not Found", 404
            return json.dumps(cs), 200
            
        except RuntimeError:
            return "Internal Server Error", 500
        except NameError:
            return "Internal Server Error", 500

class Snippets(Resource):
    def get(self):
        try:
            cslist = model.getCodeSinppets()
            return json.dumps(cslist), 200
            
        except RuntimeError:
            return "Internal Server Error", 500
        except NameError:
            return "Internal Server Error", 500

    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('code', type=str, required=True)
            parser.add_argument('name', type=str, required=True)
            args = parser.parse_args()

            name = args['name']
            code = args['code']

            date = datetime.datetime.now().date()
            id = model.addCodeSnippet(name, code, date)
            return json.dumps({'id':id[0]}), 201

        except RuntimeError:
            return "Internal Server Error", 500
        except NameError:
            return "Internal Server Error", 500

@app.route('/', methods=['GET'])
def show_homepage(id=None):
    return render_template("index.html")

@app.route('/code', methods=['GET'])
@app.route('/code/<id>', methods=['GET'])
def show_codepage(id=None):
    param_id = 0
    if id is not None:
        param_id = id
    return render_template("code.html", id=param_id)

@app.route('/run', methods=['POST'])
def runCode():
    data = request.get_json(force=True)
    code = data['code']
    uc = data['usecustom']
    inp = data['input']
    lang = data['lang']
    he = HackerEarthApi()
    r = json.dumps(he.runCode(lang, code, uc, inp))
    return r, 200

api.add_resource(Snippet, '/snippet/<string:id>')
api.add_resource(Snippets, '/snippets')

if __name__ == '__main__':
    app.run(threaded=True, host='0.0.0.0', debug=True)