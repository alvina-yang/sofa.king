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
        2. Further break down each high-level category into subcategories. For example:
           - Food: "Eating Out", "Groceries"
           - Entertainment: "Movies", "Streaming Services", "Concerts"
           - Transportation: "Rideshare", "Gas", "Public Transit"
           - Shopping: "Electronics", "Clothing", "Books"
           - Utilities: "Electricity", "Water", "Internet"
           - Subscriptions: "Streaming Services", "Fitness", "Other"
        3. Calculate the total amount spent in each subcategory and roll them up into their respective high-level categories.
        4. Provide the result as a JSON object with this exact structure:
           {{
             "total": [overall total as a number],
             "categories": {{
               "Food": {{
                 "total": [total for Food as a number],
                 "breakdown": {{
                   "Eating Out": [total for Eating Out as a number],
                   "Groceries": [total for Groceries as a number]
                 }}
               }},
               "Entertainment": {{
                 "total": [total for Entertainment as a number],
                 "breakdown": {{
                   "Movies": [total for Movies as a number],
                   "Streaming Services": [total for Streaming Services as a number],
                   "Concerts": [total for Concerts as a number]
                 }}
               }},
               "Transportation": {{
                 "total": [total for Transportation as a number],
                 "breakdown": {{
                   "Rideshare": [total for Rideshare as a number],
                   "Gas": [total for Gas as a number],
                   "Public Transit": [total for Public Transit as a number]
                 }}
               }},
               "Shopping": {{
                 "total": [total for Shopping as a number],
                 "breakdown": {{
                   "Electronics": [total for Electronics as a number],
                   "Clothing": [total for Clothing as a number],
                   "Books": [total for Books as a number]
                 }}
               }},
               "Utilities": {{
                 "total": [total for Utilities as a number],
                 "breakdown": {{
                   "Electricity": [total for Electricity as a number],
                   "Water": [total for Water as a number],
                   "Internet": [total for Internet as a number]
                 }}
               }},
               "Subscriptions": {{
                 "total": [total for Subscriptions as a number],
                 "breakdown": {{
                   "Streaming Services": [total for Streaming Services as a number],
                   "Fitness": [total for Fitness as a number],
                   "Other": [total for Other as a number]
                 }}
               }}
             }}
           }}
        5. Ensure all values are numbers, not lists or strings.
        6. Include all categories and subcategories in the output, even if the totals are 0.
        7. Do not include any categories or subcategories other than those specified.
        8. Round all numbers to two decimal places.

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
            
            # Validate the structure using the DetailedTransactionAnalysis model
            DetailedTransactionAnalysis(**parsed_result)
            
            return parsed_result
        except (ValueError, json.JSONDecodeError) as e:
            if attempt < max_retries - 1:
                print(f"Attempt {attempt + 1} failed. Retrying in {delay} seconds...")
                time.sleep(delay)
                delay *= 2  # Exponential backoff
            else:
                raise ValueError(f"Failed to extract valid JSON from LLM output after {max_retries} attempts: {e}")

    # This line should never be reached if retry logic works
    raise ValueError("Unexpected error in process_detailed_transactions")
