from flask import Flask
from controllers.keys import keys_blueprint
from controllers.message import message_blueprint
from dotenv import load_dotenv
import os
from db.mongo import init_db

load_dotenv()

app = Flask(__name__)

app.config["MONGO_URI"] = os.getenv("MONGO_URI")

init_db(app)

app.register_blueprint(keys_blueprint, url_prefix='/keys')
app.register_blueprint(message_blueprint, url_prefix='/message')

if __name__ == '__main__':
    app.run(debug=True)
