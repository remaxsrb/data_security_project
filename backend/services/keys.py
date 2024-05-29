from flask import Blueprint, jsonify, send_from_directory
from utils.json_parser import parse_json
from utils.encrypt import hash_password, verify_password, encrypt_private_key, decrypt_private_key
from Crypto.PublicKey import RSA
from models.public import PublicSchema
from db.mongo import mongo
from bson import json_util, ObjectId
import json
import datetime

class KeysService:
    def get_public_keys(self):
        public_keys = mongo.db.public.find()
        public_keys_list = [parse_json(pub) for pub in public_keys]
        return public_keys_list

    def get_private_keys(self):
        private_keys = mongo.db.private.find()
        private_keys_list = [parse_json(priv) for priv in private_keys]
        return private_keys_list

    def create_keys(self, data):
        key = self._create_rsa(data['bitsize'])

        private_key = key.export_key()

        private_key_str, tag, salt, nonce  = encrypt_private_key(private_key, data['password'])  # Convert bytes to string for easier storage


            # Export public key in PEM format
        public_key = key.publickey().export_key()
        public_key_str = public_key.decode('utf-8')

        private_key = {
            'name': data['name'],
            'email': data['email'],
            'bitsize': data['bitsize'],
            'password': hash_password(data['password']),
            'key_id': hex(key.n)[-16:],
            'private_key': private_key_str,
            'public_key': public_key_str,
            'timestamp': datetime.datetime.now(),
            'tag': tag,
            'salt': salt,
            'nonce': nonce
        }

        public_key = {
            'name': data['name'],
            'email': data['email'],
            'bitsize': data['bitsize'],
            'public_key': public_key_str,
            'timestamp': datetime.datetime.now(),
            'key_id': hex(key.n)[-16:]
        }

        public_key_result = mongo.db.public.insert_one(public_key)
        private_key_result = mongo.db.private.insert_one(private_key)

        return public_key_result.inserted_id, private_key_result.inserted_id

    def _create_rsa(self, size):
        return RSA.generate(size)

    def delete_private_key(self, id):
        mongo.db.public.delete_one({"key_id": id})

    def delete_public_key(self, id):
        mongo.db.private.delete_one({"key_id": id})

    def export_keys(self, data):
        response = None
        if data['type'] == 'private':
            return self._export_private(data)
        elif data['type'] == 'public':
            return self._export_public(data)
        else:
            return None

    def _export_private(self, data):
        response = mongo.db.private.find_one({"_id": ObjectId(data['id'])})

        if data['password'] and verify_password(response['password'], data['password']):
            key = decrypt_private_key(response['private_key'], data['password'], response['salt'], response['tag'], response['nonce'])
            print(key)
            key = key.export_key(passphrase=data['password'])
            with open(data['filename'], 'wb') as pem_file:
                pem_file.write(key)
            return send_from_directory('./', data['filename'], as_attachment=True)
        else:
            return None



    def _export_public(self, data):
        response = mongo.db.public.find_one({"_id": ObjectId(data['id'])})

        key = RSA.import_key(response['public_key']).export_key()

        with open(data['filename'], 'wb') as pem_file:
            pem_file.write(key)
        return send_from_directory('./', data['filename'], as_attachment=True)

    def import_private_key(self, file, data):
        key_data = file.read()
        key = RSA.import_key(key_data, data['password'])
        key_id = hex(key.n)[-16:]
        bitsize = key.size_in_bits()
        response = mongo.db.private.find_one({"key_id": key_id})
        if response != None:
            return "key already exists"

        private_key_str, tag, salt, nonce  = encrypt_private_key(key.export_key(), data['password'])  # Convert bytes to string for easier storage
        public_key = key.publickey().export_key()
        public_key_str = public_key.decode('utf-8')

        private_key = {
            'name': data['name'],
            'email': data['email'],
            'bitsize': bitsize,
            'public_key': public_key_str,
            'timestamp': datetime.datetime.now(),
            'key_id': key_id,
            'password': hash_password(data['password']),
            'private_key': private_key_str,
            'tag': tag,
            'salt': salt,
            'nonce': nonce
        }

        private_key_result = mongo.db.private.insert_one(private_key)

    def import_public_key(self, file, data):
        key_data = file.read()
        rsa_key = RSA.import_key(key_data)
        key_id = hex(rsa_key.n)[-16:]
        bitsize = rsa_key.size_in_bits()
        response = mongo.db.public.find_one({"key_id": key_id})
        if response != None:
            return "key already exists"

        public_key_str = rsa_key.publickey().export_key().decode('utf-8')

        public_key = {
            'name': data['name'],
            'email': data['email'],
            'bitsize': bitsize,
            'public_key': public_key_str,
            'timestamp': datetime.datetime.now(),
            'key_id': key_id
        }

        public_key_result = mongo.db.public.insert_one(public_key)