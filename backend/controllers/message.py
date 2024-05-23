from flask import Blueprint, jsonify, request
from utils.json_parser import parse_json
from models.public import PublicSchema
from services.message import MessageService
from db.mongo import mongo
from bson import json_util

import json

message_blueprint = Blueprint('message', __name__)
message_service = MessageService()

@message_blueprint.route('/send', methods=['POST'])
def send_message():
    data = request.json
    message_service.send_message(data)

    return jsonify({"message": "message successfully encrypted"})

@message_blueprint.route('/receive', methods=['POST'])
def receive_message():
    file = request.files['message']
    data = request.form.get('data')
    data = json.loads(data)
    password = data['password']
    response = message_service.receive_message(file, password)

    return jsonify(response), 200