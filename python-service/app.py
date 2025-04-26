from fastapi import FastAPI
from pydantic import BaseModel
import pickle

# Load Model
with open("task_categorizer.pkl", "rb") as f:
    vectorizer, model = pickle.load(f)

# Create FastAPI app
app = FastAPI()

# Define Request Schema
class TextRequest(BaseModel):
    text: str

# Define Prediction Route
@app.post("/predict")
def predict_category(request: TextRequest):
    x = vectorizer.transform([request.text])
    prediction = model.predict(x)[0]
    return {"category": prediction}
