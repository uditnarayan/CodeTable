import requests
import json, urllib

class HackerEarthApi:
	def __init__(self):
		self.compile_url = 'https://api.hackerearth.com/v3/code/compile/'
		self.run_url = 'https://api.hackerearth.com/v3/code/run/'
		self.client_id = 'f296b83433f1d6ff6c708e1407d0e2a3fb9f17c73c68.api.hackerearth.com'
		self.secret_key = '831e64364a3f4dee986bdc7f8955ff6e7a07cdb2'

	def runCode(self, lang, code, uc, inp):
		data = {
		    'client_secret': self.secret_key,
		    'async': 0,
		    'source': code,
		    'lang': lang,
		    'time_limit': 5,
		    'memory_limit': 262144,
		}
		print uc
		if uc == True:
			data['input'] = inp
		print data	
		r = requests.post(self.run_url, data=data) 
		return r.json()