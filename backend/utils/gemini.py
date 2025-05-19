import os
from dotenv import load_dotenv
import google.generativeai as genai
import concurrent.futures

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def generate_gemini_response(prompt: str) -> str:
    def run_blocking():
        model = genai.GenerativeModel("models/gemini-1.5-pro-latest")
        response = model.generate_content(prompt)
        return response.text

    with concurrent.futures.ThreadPoolExecutor() as executor:
        future = executor.submit(run_blocking)
        return future.result()