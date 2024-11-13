# main.py
from csv_loader import load_csv_data
from ollama_processor import process_transactions
import json

def main():
    transactions = load_csv_data('data/transactions.csv')
    
    try:
        # Process transactions using Ollama with retries
        results = process_transactions(transactions)
        
        # Print the results as formatted JSON
        print(json.dumps(results, indent=2))
        
    except ValueError as e:
        print(f"Error processing transactions: {e}")

if __name__ == "__main__":
    main()