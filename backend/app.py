from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Witaj z backendu w Pythonie!"})


if __name__ == '__main__':
    app.run(debug=True)
