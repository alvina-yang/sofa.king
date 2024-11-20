from flask import Flask, jsonify, request
from flask_cors import CORS
from csv_loader import load_csv_data
from ollama_processor import process_transactions
from goal_message import generate_goal_message
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import threading
import time
import os

app = Flask(__name__)
CORS(app)

user_data = {}  # Global variable to store user data
file_changed = False  # Flag to indicate file change

class TransactionFileHandler(FileSystemEventHandler):
    def on_modified(self, event):
        global file_changed
        if event.src_path.endswith("transactions.csv"):
            print(f"File {event.src_path} has been modified")
            file_changed = True
            update_user_data()  # Update user_data when file changes

def update_user_data():
    try:
        # Load transactions
        transactions = load_csv_data('data/transactions.csv')
        user_data['transactions'] = transactions

        # Process transactions
        results = process_transactions(transactions)
        total_amount = results['total']
        categories = results['categories']

        # Update user_data
        user_data['totalSpent'] = total_amount
        user_data['categories'] = {
            category: (amount / total_amount if total_amount > 0 else 0)
            for category, amount in categories.items()
        }

        # Generate goal message
        monthly_budget = user_data.get('monthlyBudget', 0)
        short_term_goal = user_data.get('shortTermGoal', '')
        message = generate_goal_message(monthly_budget, total_amount, short_term_goal)
        user_data['goalMessage'] = message

    except Exception as e:
        print(f"Error updating user data: {e}")

def start_file_watcher():
    path = os.path.dirname(os.path.abspath(__file__)) + "/data"
    event_handler = TransactionFileHandler()
    observer = Observer()
    observer.schedule(event_handler, path, recursive=False)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

watcher_thread = threading.Thread(target=start_file_watcher, daemon=True)
watcher_thread.start()

@app.route('/api/file-changed', methods=['GET'])
def file_changed_status():
    global file_changed
    if file_changed:
        file_changed = False  # Reset flag
        return jsonify({"fileChanged": True}), 200
    return jsonify({"fileChanged": False}), 200

@app.route('/api/user-data', methods=['POST'])
def user_data_route():
    try:
        data = request.get_json()
        monthly_budget = float(data.get("monthlyBudget", 0))
        short_term_goal = data.get("shortTermGoal", "")
        long_term_goal = data.get("longTermGoal", "")

        # Update user_data
        user_data['monthlyBudget'] = monthly_budget
        user_data['shortTermGoal'] = short_term_goal
        user_data['longTermGoal'] = long_term_goal

        # Update user_data with current transactions
        update_user_data()

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

@app.route('/api/add-transaction', methods=['POST'])
def add_transaction():
    try:
        # Parse incoming JSON data
        data = request.get_json()
        amount = float(data.get("amount"))
        date = data.get("date")  # Expected format: "YYYY-MM-DD"
        merchant = data.get("merchant")

        # Validate required fields
        if not amount or not date or not merchant:
            return jsonify({"error": "Missing required fields: 'amount', 'date', or 'merchant'"}), 400

        # Ensure transactions exist in user_data
        if "transactions" not in user_data:
            user_data["transactions"] = []

        # Add the new transaction to the list
        transaction = {
            "Amount": amount,
            "Date": date,
            "Merchant": merchant
        }
        user_data["transactions"].append(transaction)

        # Update user_data
        update_user_data()

        # Prepare and return the response
        return jsonify({
            "message": "Transaction added successfully",
            **user_data
        }), 200

    except ValueError as ve:
        return jsonify({"error": f"Invalid data: {ve}"}), 400
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
