from fastapi import FastAPI, Request
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
    allow_origins=["*"],  # or ["http://localhost:5173"] for stricter setup
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PoemRequest(BaseModel):
    text: str

@app.post("/generate")
async def generate_poem(request: PoemRequest):
    try:
        prompt = f"Write a poetic response based on this: {request.text}"
        messages = [{"role": "user", "content": prompt}]
        response = client.chat_completion(messages)
        reply = response.choices[0].message.content.strip()
        return {"poem": reply}
    except Exception as e:
        print("❌ Error in server:", e)
        return {"error": "Poem generation failed"}
