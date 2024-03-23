from flask import Flask, render_template, request
app=Flask(__name__)

@app.route('/')
def root():
    return render_template('index.html')

@app.route('/itineraire_binntal_2jours')
def itineraire_binntal_2jours():
    return render_template('binntal-ski-2-jours.html')

@app.route('/japon_jordan_chloe')
def japon_jordan_chloe():
    return render_template('japon_jordan_chloe.html')


if __name__ == '__main__':
    app.run(host="localhost", port=8080, debug=True)
