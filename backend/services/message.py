import datetime
from Crypto.PublicKey import RSA
from Crypto.Hash import SHA1
from Crypto.Signature import pss
from zlib import compress, decompress
from Crypto.Cipher import AES, CAST, PKCS1_OAEP
from Crypto.Random import get_random_bytes
from base64 import b64decode, b64encode
from db.mongo import mongo
from utils.encrypt import hash_password, verify_password, encrypt_private_key, decrypt_private_key
from io import BufferedReader, BytesIO


class MessageService:
    def send_message(self, data):
        message = self._create_message(data)
        headers, sign, sign_key_id, compressed, radix, algorithm, encryption, encryption_key_id = self._create_headers(data)

        if sign:
            message = self._sign_message(message, sign_key_id, data['password']) + message
        if compressed:
            message = compress(message)
        if encryption:
            message = self._encrypt_message(message, encryption_key_id, algorithm)
        if radix:
            message = b64encode(message)
        with open('./message.msg', 'wb') as file:
            file.write(headers)
            file.write(b'-----------------------\n')
            file.write(message)


    def _encrypt_message(self, message, encryption_key_id, algorithm):
        response = mongo.db.public.find_one({"key_id": encryption_key_id})
        key = RSA.import_key(response['public_key'])
        session_key = get_random_bytes(16)
        cipher = None
        if algorithm == 'AES128':
            cipher = AES.new(session_key, AES.MODE_EAX)
        elif algorithm == 'CAST5':
            cipher  = CAST.new(session_key, CAST.MODE_EAX)
        encrypted_message = cipher.encrypt(message)
        encrypted_session_key = PKCS1_OAEP.new(key).encrypt(session_key)
        return encrypted_session_key + cipher.nonce + encrypted_message

    def _sign_message(self, message, sign_key_id, password):
        response = mongo.db.private.find_one({"key_id": sign_key_id})
        if verify_password(response['password'], password):
            key = decrypt_private_key(response['private_key'], password, response['salt'], response['tag'], response['nonce'])

            hash = SHA1.new(message)

            message_signer = pss.new(key)
            signed_message = message_signer.sign(hash).hex()
            return b'Digest: ' + str(signed_message).encode('utf-8') + b'\n' + b'Sign-key-id: ' + str(sign_key_id).encode('utf-8') + b'\n'

    def _create_message(self, data):
        return b'' + b'Timestamp: ' + str(datetime.datetime.now()).encode('utf-8') + b'\n' + str(data['message']).encode('utf-8')

    def _create_headers(self, data):
        headers = b''
        sign = False
        compressed = False
        radix = False
        encryption = False
        algorithm = ''
        encryption_key_id = ''
        sign_key_id = ''
        if 'encryption' in data:
            headers += b'Encryption-key-id: ' + str(data['encryption_key_id']).encode('utf-8') + b'\n'
            headers += b'Encrypted: ' + str(data['encryption']).encode('utf-8') + b'\n'
            encryption_key_id = data['encryption_key_id']
            encryption = data['encryption']
        if 'algorithm' in data:
            headers += b'Algorithm: ' + str(data['algorithm']).encode('utf-8') + b'\n'
            algorithm = data['algorithm']
        if 'sign' in data:
            headers += b'Signed: ' + str(data['sign']).encode('utf-8') + b'\n'
            sign = data['sign']
            sign_key_id = data['sign_key_id']
        if 'compressed' in data:
            headers += b'Compressed: ' + str(data['compressed']).encode('utf-8') + b'\n'
            compressed = data['compressed']
        if 'radix' in data:
            headers += b'Radix: ' + str(data['radix']).encode('utf-8') + b'\n'
            radix = data['radix']

        return headers, sign, sign_key_id, compressed, radix, algorithm, encryption, encryption_key_id


    def receive_message(self, file, password):
        values = self._get_headers(file)
        message = values['message']
        radix = False
        encrypted = False
        compressed = False
        signed = False
        signing_key_id = ''
        encryption_key_id = ''
        algorithm = ''
        if values['radix'] == 'True':
            message = b64decode(message)
            radix = True

        if values['encrypted'] == 'True':
            message = self._decrypt_message(message, password, values['encryption_key_id'], values['algorithm'])
            encrypted = True
            encryption_key_id = values['encryption_key_id']
            algorithm = values['algorithm']

        if values['compressed'] == 'True':
            message = decompress(message)
            compressed = True

        if values['signed'] == 'True':
            message, signing_key_id = self._verify_signature(message)
            signed = True

        message, timestamp = self._get_original_message(message)

        return {
                    "message": message.decode('utf-8'),
                    "signed": signed,
                    "compressed": compressed,
                    "encrypted": encrypted,
                    "algorithm": algorithm,
                    "encryption_key_id": encryption_key_id,
                    "signing_key_id": signing_key_id,
                    "radix": radix,
                    "timestamp": timestamp
               }

    def _get_original_message(self, message):
        message = BytesIO(message)

        line = message.readline().strip()
        splited = line.split(b': ')
        timestamp = splited[1].decode('utf-8')

        message = message.readline().strip()

        return message, timestamp

    def _verify_signature(self, message):
        message = BytesIO(message)
        line = message.readline().strip()
        splited = line.split(b': ')
        digest =  bytes.fromhex(splited[1].decode('utf-8'))


        line = message.readline().strip()
        splited = line.split(b': ')
        signing_key_id = splited[1].decode('utf-8')

        message = message.read()

        response = mongo.db.public.find_one({"key_id": signing_key_id})

        key = RSA.import_key(response['public_key'])

        hash = SHA1.new(message)

        pss.new(key).verify(hash, digest)

        return message, signing_key_id



    def _decrypt_message(self, message, password, encryption_key_id, algorithm):
        response = mongo.db.private.find_one({"key_id": encryption_key_id})
        if verify_password(response['password'], password):
            key = decrypt_private_key(response['private_key'], password, response['salt'], response['tag'], response['nonce'])
            size = key.size_in_bytes()
            encrypted_session_key = message[:size]
            nonce = message[size:size + 16]
            message = message[size + 16:]
            session_key = PKCS1_OAEP.new(key).decrypt(encrypted_session_key)
            if algorithm == 'AES128':
                return AES.new(session_key, AES.MODE_EAX, nonce=nonce).decrypt(message)
            elif algorithm == 'CAST5':
                return CAST.new(session_key, CAST.MODE_EAX, nonce=nonce).decrypt(message)

    def _get_headers(self, file):
        encryption_key_id = ''
        algorithm = ''
        line = file.readline().strip()
        splited = line.split(b': ')
        if len(splited) > 1:
            encryption_key_id = splited[1].decode('utf-8')

        line = file.readline().strip()
        splited = line.split(b': ')
        encrypted = splited[1].decode('utf-8')

        line = file.readline().strip()
        splited = line.split(b': ')
        if len(splited) > 1:
            algorithm = splited[1].decode('utf-8')

        line = file.readline().strip()
        splited = line.split(b': ')
        signed = splited[1].decode('utf-8')

        line = file.readline().strip()
        splited = line.split(b': ')
        compressed = splited[1].decode('utf-8')

        line = file.readline().strip()
        splited = line.split(b': ')
        radix = splited[1].decode('utf-8')

        line = file.readline().strip()

        message = file.read()

        return {
            'encryption_key_id': encryption_key_id,
            'encrypted': encrypted,
            'algorithm': algorithm,
            'signed': signed,
            'compressed': compressed,
            'radix': radix,
            'message': message
        }
