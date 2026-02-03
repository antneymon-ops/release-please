from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any

app = FastAPI()


# --- Model Handlers ---

def echo_model_handler(context: Dict[str, Any], parameters: Dict[str, Any] | None = None) -> Dict[str, Any]:
    """A simple model that echoes the input context."""
    return {"echo": context}

def greeting_model_handler(context: Dict[str, Any], parameters: Dict[str, Any] | None = None) -> Dict[str, Any]:
    """A simple model that returns a greeting."""
    name = context.get("name", "World")
    return {"greeting": f"Hello, {name}!"}


# --- Model Registry ---

MODEL_REGISTRY = {
    "echo-model": echo_model_handler,
    "greeting-model": greeting_model_handler,
}


# --- Pydantic Models for API ---

class MCPRequest(BaseModel):
    model_id: str
    context: Dict[str, Any]
    parameters: Dict[str, Any] | None = None


# --- API Endpoints ---

@app.get("/")
def read_root():
    return {"message": "MCP Server is running"}

@app.post("/invoke")
async def invoke_model(request: MCPRequest):
    """Invokes a model based on the MCP request."""
    handler = MODEL_REGISTRY.get(request.model_id)

    if not handler:
        raise HTTPException(
            status_code=404,
            detail={"model_id": request.model_id, "error": {"code": 404, "message": f"Model '{request.model_id}' not found."}}
        )

    try:
        result = handler(request.context, request.parameters)
        return {"model_id": request.model_id, "result": result}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"model_id": request.model_id, "error": {"code": 500, "message": str(e)}}
        )
