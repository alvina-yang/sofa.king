# ollama_processor.py
from langchain_ollama import OllamaLLM
from langchain_core.prompts import PromptTemplate
from models import TransactionAnalysis 
import json
import time
from dotenv import load_dotenv  
from langchain_openai import ChatOpenAI
import os

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

def process_transactions(transactions, max_retries=3, delay=2):
    llm = ChatOpenAI(model="gpt-4o-mini", api_key=api_key, temperature=0)  # This can be whatever 
    
    # Create the prompt template with format instructions
    prompt = PromptTemplate(
        template="""
        IMPORTANT: Analyze the following transaction data and respond ONLY with a JSON object. Do not include any explanations, notes, or additional text.

        Transaction data:
        {transactions}

        Instructions:
        1. Categorize each transaction under these categories: "Food", "Entertainment", "Transportation", "Shopping", "Utilities", and "Subscriptions".
        2. Calculate the total amount spent in each category.
        3. Calculate the overall total of all transactions.
        4. Provide the result as a JSON object with this exact structure:
           {{
             "total": [overall total as a number],
             "categories": {{
               "Food": [total for Food as a number],
               "Entertainment": [total for Entertainment as a number],
               "Transportation": [total for Transportation as a number],
               "Shopping": [total for Shopping as a number],
               "Utilities": [total for Utilities as a number],
               "Subscriptions": [total for Subscriptions as a number]
             }}
           }}
        5. Ensure all values are numbers, not lists or strings.
        6. Include all categories in the output, even if the total is 0.
        7. Do not include any categories other than those specified.
        8. Round all numbers to two decimal places.

        Respond with ONLY the JSON object, nothing else:
        """,
        input_variables=["transactions"]
    )
    
    chain = prompt | llm
    
    for attempt in range(max_retries):
        try:
            content = chain.invoke({"transactions": json.dumps(transactions, indent=4)})
            result = content.content
            
            # Extract JSON from the result
            start_index = result.index('{')
            end_index = result.rindex('}') + 1
            json_str = result[start_index:end_index]
            parsed_result = json.loads(json_str)
            
            # Validate the structure using the TransactionAnalysis model
            TransactionAnalysis(**parsed_result)
            
            return parsed_result
        except (ValueError, json.JSONDecodeError) as e:
            if attempt < max_retries - 1:
                print(f"Attempt {attempt + 1} failed. Retrying in {delay} seconds...")
                time.sleep(delay)
                delay *= 2  # Exponential backoff
            else:
                raise ValueError(f"Failed to extract valid JSON from LLM output after {max_retries} attempts: {e}")

    # This line should never be reached lol if it does then uh
    raise ValueError("Unexpected error in process_transactions")