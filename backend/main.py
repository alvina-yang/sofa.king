from flask import Flask, jsonify, request
from flask_cors import CORS
from csv_loader import load_csv_data
from ollama_processor import process_transactions
from goal_message import generate_goal_message

app = Flask(__name__)
CORS(app)

user_data = {}  # Global variable to store user data

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


@app.route('/api/user-data', methods=['POST'])
def user_data_route():
    try:
        data = request.get_json()
        monthly_budget = float(data.get("monthlyBudget"))
        short_term_goal = data.get("shortTermGoal")
        long_term_goal = data.get("longTermGoal")

        # Store the data
        user_data['monthlyBudget'] = monthly_budget
        user_data['shortTermGoal'] = short_term_goal
        user_data['longTermGoal'] = long_term_goal

        # Load transactions
        transactions = load_csv_data('data/transactions.csv')
        user_data['transactions'] = transactions

        # Process transactions
        results = process_transactions(transactions)
        total_amount = results['total']
        categories = results['categories']

        # Generate goal message
        message = generate_goal_message(monthly_budget, total_amount, short_term_goal)
        user_data['goalMessage'] = message
        user_data['totalSpent'] = total_amount
        user_data['categories'] = {category: (amount / total_amount) for category, amount in categories.items()}

        # Prepare response
        response_data = {
            "message": "User data received successfully",
            **user_data
        }
        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/get-user-data', methods=['GET'])
def get_user_data():
    if user_data:
        return jsonify(user_data), 200
    else:
        return jsonify({"error": "No user data available"}), 404


if __name__ == "__main__":
    app.run(debug=True)
