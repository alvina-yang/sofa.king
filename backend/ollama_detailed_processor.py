from langchain_ollama import OllamaLLM
from langchain_core.prompts import PromptTemplate
from models import DetailedTransactionAnalysis
import json
import time

def process_detailed_transactions(transactions, max_retries=3, delay=2):
    llm = OllamaLLM(model="llama3.1")
    
    # Create the prompt template with format instructions
    prompt = PromptTemplate(
        template="""
        IMPORTANT: Analyze the following transaction data and respond ONLY with a JSON object. Do not include any explanations, notes, or additional text.

        Transaction data:
        {transactions}

        Instructions:
        1. Categorize each transaction into these high-level categories: "Food", "Entertainment", "Transportation", "Shopping", "Utilities", and "Subscriptions".
        2. Further break down each high-level category into personalized subcategories based on transaction history. For example:
           - Food might include subcategories like "Fast Food",.... depending on spending patterns.
           - Entertainment might include "Streaming Services",...
           - Transportation might include "Gas", "Transport Tickets"....etc
           - Shopping might include "Clothing",...
           - Utilities might include "Electricity",....
           - Subscriptions might include "Fitness Memberships",...
        3. The subcategories should reflect actual user spending, meaning only include subcategories with non-zero spending based on the provided transaction data.
        4. Calculate the total amount spent in each subcategory and roll them up into their respective high-level categories.
        5. Provide the result as a JSON object with this exact structure:
           {{
             "total": [overall total as a number],
             "categories": {{
               "Food": {{
                 "total": [total for Food as a number],
                 "breakdown": {{
                   "Subcategory1": [total for Subcategory1 as a number],
                   "Subcategory2": [total for Subcategory2 as a number]
                 }}
               }},
               "Entertainment": {{
                 "total": [total for Entertainment as a number],
                 "breakdown": {{
                   "Subcategory1": [total for Subcategory1 as a number],
                   "Subcategory2": [total for Subcategory2 as a number]
                 }}
               }},
               ... (repeat for all high-level categories)
             }}
           }}
        6. Ensure all values are numbers, not lists or strings.
        7. Include only subcategories with non-zero spending based on the transaction data.
        8. Round all numbers to two decimal places.
        9. Ensure that each total for all of the subcategories adds up exactly to the total for the main category.
        10. REMEMBER, NONE OF THE SUBCATEGORIES SHOULD HAVE ZERO SPENDING

        Respond with ONLY the JSON object, nothing else:
        """,
        input_variables=["transactions"]
    )
    
    chain = prompt | llm
    
    for attempt in range(max_retries):
        try:
            result = chain.invoke({"transactions": json.dumps(transactions, indent=4)})
            
            # Extract JSON from the result
            start_index = result.index('{')
            end_index = result.rindex('}') + 1
            json_str = result[start_index:end_index]
            parsed_result = json.loads(json_str)
            
            # Recompute category totals from subcategories
            for category, data in parsed_result['categories'].items():
                sub_total = sum(data['breakdown'].values())
                data['total'] = round(sub_total, 2)

            # Recompute overall total
            total = sum(data['total'] for data in parsed_result['categories'].values())
            parsed_result['total'] = round(total, 2)

            # Validate the structure using the DetailedTransactionAnalysis model
            DetailedTransactionAnalysis(**parsed_result)
            
            return parsed_result
        except (ValueError, json.JSONDecodeError, KeyError) as e:
            if attempt < max_retries - 1:
                print(f"Attempt {attempt + 1} failed. Retrying in {delay} seconds...")
                time.sleep(delay)
                delay *= 2  # Exponential backoff
            else:
                raise ValueError(f"Failed to extract valid JSON from LLM output after {max_retries} attempts: {e}")

    raise ValueError("Unexpected error in process_detailed_transactions")
