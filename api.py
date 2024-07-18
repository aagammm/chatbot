from fastapi import FastAPI, HTTPException

import torch
from transformers import T5ForConditionalGeneration, T5Tokenizer

# Initialize tokenizer and model
tokenizer = T5Tokenizer.from_pretrained("google/flan-t5-xl")
model = T5ForConditionalGeneration.from_pretrained("google/flan-t5-xl")

# Move the model to the appropriate device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
# Initialize FastAPI app
app = FastAPI()

# Initialize tokenizer and model

# Function to generate summaries
def generate_summary(text):
    # Tokenize input text
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
    input_ids = inputs.input_ids.to(device)
    
    # Generate summary
    summary_ids = model.generate(input_ids, num_beams=4, length_penalty=2.0, max_length=512, min_length=128, early_stopping=True)
    
    # Decode summary
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return summary

# Define endpoint to generate summaries
@app.post("/summarize/")
def summarize(text: str):
    try:
        summary = generate_summary(text)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))