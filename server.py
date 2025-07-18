from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

load_dotenv()

HF_TOKEN = os.getenv("HF_API_KEY")

client = InferenceClient(
    model="mistralai/Mistral-7B-Instruct-v0.3",
    token=HF_TOKEN,
    provider="novita"
)

app = FastAPI()

# CORS setup to allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MotivationRequest(BaseModel):
    text: str

@app.post("/generate")
async def generate_motivation(request: MotivationRequest):
    try:
        prompt = f"Provide a short, motivational or positive sentence to encourage someone who says: '{request.text}'"
        messages = [{"role": "user", "content": prompt}]
        response = client.chat_completion(messages)
        reply = response.choices[0].message.content.strip()
        return {"sentence": reply}
    except Exception as e:
        print("❌ Error in server:", e)
        return {"error": "Motivation generation failed"}

