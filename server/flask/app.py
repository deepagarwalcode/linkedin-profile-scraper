from flask import Flask, request, jsonify
import joblib
import torch
from transformers import BertTokenizer, BertModel
import numpy as np
import xgboost as xgb

app = Flask(__name__)

tokenizer = BertTokenizer.from_pretrained("bert_tokenizer")
bert = BertModel.from_pretrained("bert_model", output_hidden_states=True)
xgb_model = xgb.Booster()
xgb_model.load_model("xgboost_model.json")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    text = data.get("profile_text")

    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=32)
    with torch.no_grad():
        output = bert(**inputs)
        embedding = torch.stack(output.hidden_states[-4:]).mean(0)[:, 0, :].numpy()

    dmatrix = xgb.DMatrix(embedding)
    pred = xgb_model.predict(dmatrix)
    return jsonify({"score": float(pred[0])})

if __name__ == "__main__":
    app.run(debug=True)
