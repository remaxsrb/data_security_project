from flask import Blueprint, jsonify
# from services.user_service import UserService

message_blueprint = Blueprint('message', __name__)
#user_service = UserService()

@message_blueprint.route('/send', methods=['GET'])
def send_message():
    #users = user_service.get_all_users()
    return jsonify({"test": "RADI I OVOOO"})
