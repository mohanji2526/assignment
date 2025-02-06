# backend/models.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Contract(db.Model):
    __tablename__ = 'contracts'
    id = db.Column(db.Integer, primary_key=True)
    client_name = db.Column(db.String(100), nullable=False)
    contract_id = db.Column(db.String(100), unique=True, nullable=False)
    status = db.Column(db.String(50), nullable=False, default='Draft')
    details = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "client_name": self.client_name,
            "contract_id": self.contract_id,
            "status": self.status,
            "details": self.details,
            "created_at": self.created_at.isoformat()
        }