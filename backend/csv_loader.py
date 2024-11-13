# csv_loader.py
import csv

def load_csv_data(file_path):
    transactions = []
    try:
        with open(file_path, mode='r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                transaction = {
                    "Date": row["Date"],
                    "Merchant": row["Merchant"],
                    "Amount": float(row["Amount"])  # Convert amount to float
                }
                transactions.append(transaction)
        return transactions
    except Exception as e:
        raise RuntimeError(f"Error loading {file_path}: {e}") from e
