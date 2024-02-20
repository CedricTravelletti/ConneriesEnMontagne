from flask import Flask, render_template, request
app=Flask(__name__)

@app.route('/')
def root():
    return render_template('index.html')

@app.route('/itineraire_binntal_2jours')
def itineraire_binntal_2jours():
    return render_template('binntal-ski-2-jours.html')


if __name__ == '__main__':
    app.run(host="localhost", port=8080, debug=True)
