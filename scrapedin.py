from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.get('/search')
def search():
    return render_template('jobs.html')
