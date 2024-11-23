from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv  
from langchain_openai import ChatOpenAI
import os

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

def generate_goal_message(monthly_budget, total_amount, short_term_goal):
    # Calculate remaining amount
    remaining = monthly_budget - total_amount

    # Ensure remaining is a positive amount before proceeding
    if remaining <= 0:
        return "You've already exceeded your budget for this month."

    # Initialize the LLM model
    # llm = OllamaLLM(model="llama3.1")
    llm = ChatOpenAI(model="gpt-4o-mini", api_key=api_key)

    prompt_text = f"""
    Imagine the user has a goal: '{short_term_goal}'. Write a motivational and friendly message to encourage them.
    The message should be creative, showing how close they are to achieving their goal with just ${remaining:.2f} more to save.

    Examples:
    - "Just ${remaining:.2f} more and you'll be driving your dream car!"
    - "Only ${remaining:.2f} left before you're enjoying your new adventure!"
    - "You're so close to {short_term_goal}! Keep it up!"

    IMPORTANT:
    - If the goal is innapropriate, say "You're so close to {short_term_goal}! Keep it up!" or another general message

    Provide the message only, without any extra characters or quotes.
    """

    # Invoke the LLM with the generated prompt text
    result_content = llm.invoke(prompt_text)
    result = result_content.content

    # Return the generated message without any quotes or extra formatting
    return result.strip().replace('"', '')
