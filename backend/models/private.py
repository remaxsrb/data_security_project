from marshmallow import Schema, fields, validate

class PrivateSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1))
    email = fields.Email(required=True)
    bitsize = fields.Int(required=True)
    private_key = fields.Str(required=True)
    public_key = fields.Str(required=True)
    timestamp = fields.Str(required=True)
    password = fields.Str(required=True)
    key_id = fields.Str(required=True)
    salt = fields.Str(required=True)
    tag = fields.Str(required=True)
    nonce = fields.Str(required=True)