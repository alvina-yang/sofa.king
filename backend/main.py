# app.py
from flask import Flask, jsonify
from flask_cors import CORS
from csv_loader import load_csv_data
from ollama_processor import process_transactions
import json

app = Flask(__name__)
CORS(app)

@app.route('/api/transaction-analysis', methods=['GET'])
def transaction_analysis():
    try:
        # Load and process transactions
        transactions = load_csv_data('data/transactions.csv')
        results = process_transactions(transactions)
        
        # Calculate percentages for each category
        total_amount = results["total"]
        categories = results["categories"]
        
        # Calculate percentage for each category
        category_percentages = {category: (amount / total_amount) for category, amount in categories.items()}

        # Prepare final data structure
        response_data = {
            "total": total_amount,
            "categories": category_percentages,
        }

        return jsonify(response_data), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
