from bson import json_util
import json

def parse_json(data):
    # Convert the MongoDB document to JSON string
    json_str = json_util.dumps(data)
    # Convert the JSON string back to a dictionary
    data_dict = json.loads(json_str)

    # Iterate through the dictionary and convert any `ObjectId` structures
    if isinstance(data_dict, list):  # If it's a list of documents
        for document in data_dict:
            if "$oid" in document.get('_id', {}):
                document['_id'] = document['_id']['$oid']
    elif isinstance(data_dict, dict):  # If it's a single document
        if "$oid" in data_dict.get('_id', {}):
            data_dict['_id'] = data_dict['_id']['$oid']

    return data_dict