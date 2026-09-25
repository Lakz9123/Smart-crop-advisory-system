import io
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoImageProcessor, AutoModelForImageClassification
from PIL import Image
import torch

app = FastAPI(title="Plant Disease Inference API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and processor
MODEL_NAME = "linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification"
print(f"Loading model {MODEL_NAME}...")
try:
    processor = AutoImageProcessor.from_pretrained(MODEL_NAME)
    model = AutoModelForImageClassification.from_pretrained(MODEL_NAME)
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")

class PredictRequest(BaseModel):
    image_path: str

@app.post("/predict")
async def predict(req: PredictRequest):
    try:
        # Resolve the full path based on the parent directory
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        full_path = os.path.join(base_dir, req.image_path)
        
        if not os.path.exists(full_path):
            raise HTTPException(status_code=404, detail="Image file not found")
            
        image = Image.open(full_path).convert("RGB")
        
        inputs = processor(images=image, return_tensors="pt")
        with torch.no_grad():
            outputs = model(**inputs)
            
        logits = outputs.logits
        # Calculate probabilities
        probabilities = torch.nn.functional.softmax(logits, dim=-1)
        
        predicted_class_idx = logits.argmax(-1).item()
        confidence = probabilities[0, predicted_class_idx].item()
        
        predicted_label = model.config.id2label[predicted_class_idx]
        
        return {
            "success": True,
            "prediction": predicted_label,
            "confidence": round(confidence * 100, 2)
        }
        
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5001)
