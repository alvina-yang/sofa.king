from langchain_ollama import OllamaLLM
from langchain_core.prompts import PromptTemplate
import json
import time
def generate_insights(category, current_month_total, last_month_total, last_year_total, transactions, max_retries=3, delay=2):
    llm = OllamaLLM(model="llama3.1")  

    # Create a dynamic prompt that ensures comparisons make sense
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
        1. Provide an actionable insight for the current month. Example: "You have spent ${current_month_total} on {category} so far this month. Consider reviewing these expenses to stay within budget."
        2. Compare this month to last month:
           - If spending increased: "You spent $X more than last month on {category}."
           - If spending decreased: "You saved $X compared to last month on {category}. Keep up the good work!"
        3. Compare this month to last year:
           - If spending increased: "You spent $X more this month compared to last year. Monitor trends to avoid overspending."
           - If spending decreased: "You saved $X compared to the same period last year on {category}. Well done!"
        4. Provide **creative and actionable tips** for managing spending in the category. Example: 
           - "Consider tracking {category}-related expenses daily."
           - "Look for discounts or alternatives to reduce spending on {category}."
        5. Provide the output as a JSON object with this exact structure:
           {{
             "category": "{category}",
             "current_month_insight": [string],
             "last_month_insight": [string],
             "last_year_insight": [string],
             "general_tips": [list of strings]
           }}
        6. Ensure comparisons are always logical and positive.
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

            # print(result)
            
            # Extract JSON from the result
            start_index = result.index('{')
            end_index = result.rindex('}') + 1
            json_str = result[start_index:end_index]
            parsed_result = json.loads(json_str)

            # Validate JSON structure
            required_fields = ["category", "current_month_insight", "last_month_insight", "last_year_insight", "general_tips"]
            if not all(field in parsed_result for field in required_fields):
                raise ValueError("Missing required fields in the JSON response.")

            return parsed_result
        except (ValueError, json.JSONDecodeError) as e:
            if attempt < max_retries - 1:
                print(f"Attempt {attempt + 1} failed. Retrying in {delay} seconds...")
                time.sleep(delay)
                delay *= 2  # Exponential backoff
            else:
                print(f"Error generating insights: {e}")
                raise ValueError(f"Failed to extract valid JSON from LLM output after {max_retries} attempts: {e}")
