from marshmallow import Schema, fields, post_dump, validate
from bson import ObjectId

class PublicSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1))
    email = fields.Email(required=True)
    bitsize = fields.Int(required=True)
    public_key = fields.Str(required=True)
    timestamp = fields.Str(required=True)
    key_id = fields.Str(required=True)