import bcrypt
from Crypto.Cipher import AES
from Crypto.PublicKey import RSA
from Crypto.Protocol.KDF import scrypt
from Crypto.Random import get_random_bytes
from base64 import urlsafe_b64encode, urlsafe_b64decode

def hash_password(password):
    password_bytes = password.encode('utf-8')
    hashed_password = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
    return hashed_password.decode('utf-8')

def verify_password(hashed_password, password_to_verify):
    return bcrypt.checkpw(password_to_verify.encode('utf-8'), hashed_password.encode('utf-8'))

def encrypt_private_key(private_key, password):
    # Generate salt and key
    salt = get_random_bytes(16)
    key = scrypt(password, salt, key_len=32, N=2**14, r=8, p=1)

    # Encrypt the private key
    cipher = AES.new(key, AES.MODE_GCM)
    ciphertext, tag = cipher.encrypt_and_digest(private_key)

    return urlsafe_b64encode(ciphertext).decode('utf-8'), urlsafe_b64encode(tag).decode('utf-8'), urlsafe_b64encode(salt).decode('utf-8'), urlsafe_b64encode(cipher.nonce).decode('utf-8')

def decrypt_private_key(encrypted_private_key, password, salt, tag, nonce):
    # Decode the base64 encoded values
    encrypted_private_key = urlsafe_b64decode(encrypted_private_key)
    salt = urlsafe_b64decode(salt)
    tag = urlsafe_b64decode(tag)
    nonce = urlsafe_b64decode(nonce)

    # Derive the key using the same parameters and password
    key = scrypt(password, salt, key_len=32, N=2**14, r=8, p=1)

    # Decrypt the private key
    cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
    decrypted_key = cipher.decrypt_and_verify(encrypted_private_key, tag)

    # Load the private key (PyCryptoDome does not directly support loading key from bytes, this step may vary)
    return RSA.import_key(decrypted_key)