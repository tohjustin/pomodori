#!/usr/bin/env python3
# encoding: utf-8
from flask import Flask, send_from_directory

# serve webpack build output files directly from `/dist` folder
app = Flask(__name__, static_folder='dist', static_url_path='')


@app.route('/')
def index():
    return send_from_directory('', 'index.html')


if __name__ == '__main__':
    app.run(debug=True)
