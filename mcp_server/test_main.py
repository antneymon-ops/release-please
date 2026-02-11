from fastapi.testclient import TestClient
from .main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "MCP Server is running"}

def test_invoke_echo_model():
    request_data = {
        "model_id": "echo-model",
        "context": {"key": "value", "number": 123}
    }
    response = client.post("/invoke", json=request_data)
    assert response.status_code == 200
    response_json = response.json()
    assert response_json["model_id"] == "echo-model"
    assert response_json["result"]["echo"] == {"key": "value", "number": 123}

def test_invoke_greeting_model_with_name():
    request_data = {
        "model_id": "greeting-model",
        "context": {"name": "Jules"}
    }
    response = client.post("/invoke", json=request_data)
    assert response.status_code == 200
    response_json = response.json()
    assert response_json["model_id"] == "greeting-model"
    assert response_json["result"]["greeting"] == "Hello, Jules!"

def test_invoke_greeting_model_default_name():
    request_data = {
        "model_id": "greeting-model",
        "context": {}
    }
    response = client.post("/invoke", json=request_data)
    assert response.status_code == 200
    response_json = response.json()
    assert response_json["model_id"] == "greeting-model"
    assert response_json["result"]["greeting"] == "Hello, World!"

def test_invoke_model_not_found():
    request_data = {
        "model_id": "non-existent-model",
        "context": {}
    }
    response = client.post("/invoke", json=request_data)
    assert response.status_code == 404
    response_json = response.json()
    assert "detail" in response_json
    assert response_json["detail"]["model_id"] == "non-existent-model"
    assert "not found" in response_json["detail"]["error"]["message"]

def test_invoke_malformed_request_missing_model_id():
    # Missing model_id
    request_data = {
        "context": {}
    }
    response = client.post("/invoke", json=request_data)
    # FastAPI's Pydantic validation returns a 422 Unprocessable Entity error
    assert response.status_code == 422

def test_invoke_malformed_request_missing_context():
    # Missing context
    request_data = {
        "model_id": "echo-model"
    }
    response = client.post("/invoke", json=request_data)
    assert response.status_code == 422
