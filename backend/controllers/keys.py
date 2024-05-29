from flask import Blueprint, jsonify, request
from utils.json_parser import parse_json
from models.public import PublicSchema
from services.keys import KeysService
from db.mongo import mongo
from bson import json_util

import json


# from services.user_service import UserService

keys_blueprint = Blueprint('keys', __name__)
keys_service = KeysService()


@keys_blueprint.route('/public', methods=['GET'])
def get_public_keys():
    public_keys = keys_service.get_public_keys()
    return jsonify(public_keys), 200

@keys_blueprint.route('/private', methods=['GET'])
def get_private_keys():
    private_keys = keys_service.get_private_keys()
    return jsonify(private_keys), 200

@keys_blueprint.route('/create', methods=['POST'])
def create_keys():
    data = request.json
    if data['bitsize'] not in [1024, 2048]:
        return jsonify({"error": "bit size must be 1024 or 2048"}), 400
    public_key_id, private_key_id = keys_service.create_keys(data)

    private_keys = keys_service.get_private_keys()
    public_keys = keys_service.get_public_keys()

    response = {
        'private_keys': private_keys,
        'public_keys': public_keys
    }
    return jsonify(response), 201

@keys_blueprint.route('/delete/<string:key_id>', methods=['DELETE'])
def delete_keys(key_id):
    keys_service.delete_private_key(key_id)
    keys_service.delete_public_key(key_id)

    private_keys = keys_service.get_private_keys()
    public_keys = keys_service.get_public_keys()

    response = {
        'private_keys': private_keys,
        'public_keys': public_keys
    }

    return jsonify(response), 200

@keys_blueprint.route('/export', methods=['POST'])
def export_keys():
    data = request.json

    file = keys_service.export_keys(data)
    if file is None:
        return jsonify({"error": "error"}), 400

    return file

@keys_blueprint.route('/import', methods=['POST'])
def import_keys():
    data = {
        'type': request.form.get('type'),
        'password': request.form.get('password'),
        'name': request.form.get('name'),
        'email': request.form.get('email')
    }

    message = ''

    file = request.files['key']
    if data['type'] == 'private':
        message = keys_service.import_private_key(file, data)
    elif data['type'] == 'public':
        message = keys_service.import_public_key(file, data)
    else:
        return jsonify({"error": "bad request"}), 400

    private_keys = keys_service.get_private_keys()
    public_keys = keys_service.get_public_keys()

    response = {
        'private_keys': private_keys,
        'public_keys': public_keys,
        'message': message
    }

    return jsonify(response), 200

@keys_blueprint.route('/check', methods=['POST'])
def check_password():
    data = request.json

    flag = keys_service.check_password(data)

    return jsonify(flag), 200


