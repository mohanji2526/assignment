# backend/app.py
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO, emit
from models import db, Contract
from dotenv import load_dotenv
import os
# Load environment variables from .env
load_dotenv()
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  

# Database configuration//
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://your_db_user:your_db_password@localhost/contracts_db'
app.config['SQLALCHEMY_DATABASE_URI']=os.getenv("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)

socketio = SocketIO(app, cors_allowed_origins="*")

# Create database tables
# with app.app_context():
#     db.create_all()
#     # db.create_all()

# Routes and SocketIO events will be added here


@app.route('/api/contracts', methods=['POST'])
def upload_contract():
    data = request.get_json()
    print("#############",data)
    if not data or 'client_name' not in data or 'contract_id' not in data or 'details' not in data:
        return jsonify({"error": "Missing required fields"}), 400

    new_contract = Contract(
        client_name=data['client_name'],
        contract_id=data['contract_id'],
        details=data['details'],
        status=data.get('status', 'Draft')
    )

    db.session.add(new_contract)
    db.session.commit()

    # Emit real-time update
    socketio.emit('contract_updated', new_contract.to_dict())

    return jsonify(new_contract.to_dict()), 201

@app.route('/api/contracts', methods=['GET'])
def list_contracts():
    status = request.args.get('status')
    client_name = request.args.get('client_name')
    contract_id = request.args.get('contract_id')
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))

    query = Contract.query

    if status:
        query = query.filter_by(status=status)
    if client_name:
        query = query.filter(Contract.client_name.ilike(f'%{client_name}%'))
    if contract_id:
        query = query.filter_by(contract_id=contract_id)

    contracts = query.paginate(page=page, per_page=limit, error_out=False)

    return jsonify({
        "data": [contract.to_dict() for contract in contracts.items],
        "page": contracts.page,
        "total_pages": contracts.pages,
        "total_items": contracts.total
    })


@app.route('/api/contracts/<int:contract_id>', methods=['PUT'])
def update_contract(contract_id):
    contract = Contract.query.get_or_404(contract_id)
    data = request.get_json()

    if 'client_name' in data:
        contract.client_name = data['client_name']
    if 'contract_id' in data:
        contract.contract_id = data['contract_id']
    if 'status' in data:
        contract.status = data['status']
    if 'details' in data:
        contract.details = data['details']

    db.session.commit()

    # Emit real-time update
    socketio.emit('contract_updated', contract.to_dict())

    return jsonify(contract.to_dict())

@app.route('/api/contracts/<int:contract_id>', methods=['DELETE'])
def delete_contract(contract_id):
    contract = Contract.query.get_or_404(contract_id)
    db.session.delete(contract)
    db.session.commit()

    # Emit real-time update
    socketio.emit('contract_deleted', {"id": contract_id})

    return jsonify({"message": "Contract deleted successfully"})

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app, debug=True)

