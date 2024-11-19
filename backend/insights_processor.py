from langchain_ollama import OllamaLLM
from langchain_core.prompts import PromptTemplate
import json
import time

def generate_insights(category, current_month_total, last_month_total, last_year_total, transactions, max_retries=3, delay=2):
    llm = OllamaLLM(model="llama3.1")  

    # Create the prompt template with format instructions
    prompt = PromptTemplate(
        template="""
        IMPORTANT: Analyze the following transaction data and respond ONLY with a JSON object. Do not include any explanations, notes, or additional text.

        Transaction data:
        {transactions}

        Insights should be based on the category: {category}
        Current month total: {current_month_total}
        Last month total: {last_month_total}
        Last year total: {last_year_total}

        Instructions:
        1. Provide an insight for the current month. Example: "You could have saved $X by reducing spending on {category}".
        2. Provide an insight comparing this month to last month. Example: "You saved $X more than last month on {category}" or "You spent $X more than last month on {category}".
        3. Provide an insight comparing this month to last year. Example: "You are on track to spend X times more than last year on {category}".
        4. Provide general tips for reducing spending in the category. Example: "Consider cutting back on subscription services or reducing reliance on rideshares".
        5. Provide the output as a JSON object with this exact structure:
           {{
             "category": "{category}",
             "current_month_insight": [string],
             "last_month_insight": [string],
             "last_year_insight": [string],
             "general_tips": [list of strings]
           }}
        6. Ensure all strings are concise and actionable.
        7. Include all required fields in the output, even if they are empty.

        Respond with ONLY the JSON object, nothing else:
        """,
        input_variables=["category", "current_month_total", "last_month_total", "last_year_total", "transactions"]
    )

    chain = prompt | llm

    for attempt in range(max_retries):
        try:
            result = chain.invoke({
                "category": category,
                "current_month_total": current_month_total,
                "last_month_total": last_month_total,
                "last_year_total": last_year_total,
                "transactions": json.dumps(transactions, indent=4)
            })
            
            # Extract JSON from the result
            start_index = result.index('{')
            end_index = result.rindex('}') + 1
            json_str = result[start_index:end_index]
            parsed_result = json.loads(json_str)
            
            # Validate basic JSON structure
            if not all(key in parsed_result for key in ["category", "current_month_insight", "last_month_insight", "last_year_insight", "general_tips"]):
                raise ValueError("Missing required fields in the JSON response.")
            
            return parsed_result
        except (ValueError, json.JSONDecodeError) as e:
            if attempt < max_retries - 1:
                print(f"Attempt {attempt + 1} failed. Retrying in {delay} seconds...")
                time.sleep(delay)
                delay *= 2  # Exponential backoff
            else:
                raise ValueError(f"Failed to extract valid JSON from LLM output after {max_retries} attempts: {e}")

    # This line should never be reached if retry logic works
    raise ValueError("Unexpected error in generate_insights")
