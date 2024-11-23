from flask import Flask, jsonify, request
from flask_cors import CORS
from ollama_detailed_processor import process_detailed_transactions
from csv_loader import load_csv_data
from insights_processor import generate_insights
from ollama_processor import process_transactions
from goal_message import generate_goal_message
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import threading
import time
import os
import random
import csv  
from datetime import datetime 


app = Flask(__name__)
CORS(app)

user_data = {}  # Global variable to store user data
file_changed = False  # Flag to indicate file change
subcategories = {}  # Global variable to store subcategories
insights_data = {}  # Global variable to store insights

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
        user_data['categories'] = categories

       # Process detailed transactions for subcategories
        detailed_results = process_detailed_transactions(transactions)
        global subcategories
        subcategories = detailed_results.get("categories", {})

        # Ensure category totals are consistent with subcategories
        for category, data in subcategories.items():
            # Recompute category total as the sum of its subcategories
            sub_total = sum(data['breakdown'].values())
            data['total'] = round(sub_total, 2)
            # Update the main category total to match sub_total
            categories[category] = round(sub_total, 2)

        # Generate goal message
        monthly_budget = user_data.get('monthlyBudget', 0)
        short_term_goal = user_data.get('shortTermGoal', '')
        message = generate_goal_message(monthly_budget, total_amount, short_term_goal)
        user_data['goalMessage'] = message

        # Generate insights for all categories
        generate_all_insights()

    except Exception as e:
        print(f"Error updating user data: {e}")


def generate_all_insights():
    try:
        insights = {}
        categories = user_data.get('categories', {})
        transactions = user_data.get('transactions', [])

        for category in categories:
            # Use actual total for the current month's category
            current_month_total = categories.get(category, 0)
            # Simulate last month's and last year's totals
            last_month_total = round(current_month_total * random.uniform(0.8, 1.2), 2)
            last_year_total = round(current_month_total * random.uniform(0.6, 1.4), 2)

            # Generate insights using actual data
            insight = generate_insights(
                category,
                current_month_total,
                last_month_total,
                last_year_total,
                transactions
            )
            insights[category] = insight

        # Store insights in user_data
        user_data['insights'] = insights

    except Exception as e:
        print(f"Error generating insights: {e}")

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

@app.route('/api/get-subcategories/<category>', methods=['GET'])
def get_subcategories(category):
    if category in subcategories:
        return jsonify(subcategories[category]), 200
    else:
        return jsonify({"error": f"No subcategories found for category {category}"}), 404

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
        data = request.get_json()
        amount = float(data.get("amount"))
        date_str = data.get("date")
        merchant = data.get("merchant")

        if not amount or not date_str or not merchant:
            return jsonify({"error": "Missing required fields: 'amount', 'date', or 'merchant'"}), 400

        try:
            date_obj = datetime.strptime(date_str, "%Y-%m-%d")
            date = date_obj.strftime("%Y-%m-%d")
        except ValueError:
            return jsonify({"error": "Invalid date format. Expected YYYY-MM-DD."}), 400

        csv_file = 'data/transactions.csv'
        fieldnames = ['Date', 'Merchant', 'Amount']

        with open(csv_file, mode='a', newline='') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

            # Write header only if the file is new or empty
            if csvfile.tell() == 0:
                writer.writeheader()

            # Write a new transaction row
            writer.writerow({'Date': date, 'Merchant': merchant, 'Amount': amount})

        # Update user data to reflect the new transaction
        update_user_data()

        global file_changed
        file_changed = True

        return jsonify({"message": "Transaction added successfully"}), 200

    except ValueError as ve:
        return jsonify({"error": f"Invalid data: {ve}"}), 400
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/api/update-budget', methods=['POST'])
def update_budget():
    try:
        # Parse the incoming JSON data
        data = request.get_json()
        new_budget = float(data.get("monthlyBudget", 0))

        if new_budget <= 0:
            return jsonify({"error": "Budget must be greater than 0"}), 400

        user_data['monthlyBudget'] = new_budget

        update_user_data()

        global file_changed
        file_changed = True

        return jsonify({"message": "Budget updated successfully", **user_data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/get-insights/<category>', methods=['GET'])
def get_insights(category):
    try:
        # Retrieve precomputed insights from user_data
        insights = user_data.get('insights', {})

        if category in insights:
            return jsonify(insights[category]), 200
        else:
            return jsonify({"error": f"No insights found for category '{category}'."}), 404

    except Exception as e:
        print(f"Error retrieving insights for category '{category}': {e}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
