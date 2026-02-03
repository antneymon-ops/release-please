# Model Context Protocol (MCP) Specification

This document defines the specification for the Model Context Protocol (MCP), a standardized way to interact with machine learning models.

## Protocol Overview

The protocol is based on a simple request-response model over HTTP. The client sends a JSON request to the server's `/invoke` endpoint, and the server returns a JSON response.

## Request Format

A valid MCP request must be a JSON object with the following fields:

- `model_id` (string, required): The unique identifier for the model to be invoked.
- `context` (object, required): The input data for the model. The structure of this object is model-dependent.
- `parameters` (object, optional): Additional parameters to control the model's behavior (e.g., temperature, max tokens).

### Example Request

```json
{
  "model_id": "text-summarizer-v1",
  "context": {
    "text": "Jules is an extremely skilled software engineer. His purpose is to assist users by completing coding tasks, such as solving bugs, implementing features, and writing tests. He is resourceful and will use the tools at his disposal to accomplish his goals."
  },
  "parameters": {
    "max_length": 20
  }
}
```

## Response Format

A valid MCP response will be a JSON object with the following fields:

- `model_id` (string, required): The identifier of the model that processed the request.
- `result` (object, conditional): The output from the model. This field is **required on success**.
- `error` (object, conditional): An object describing an error if one occurred. This field is **required on failure**.

### Example Success Response

```json
{
  "model_id": "text-summarizer-v1",
  "result": {
    "summary": "Jules is a skilled software engineer who assists users with coding tasks."
  }
}
```

### Example Error Response

```json
{
  "model_id": "non-existent-model-v1",
  "error": {
    "code": 404,
    "message": "Model 'non-existent-model-v1' not found."
  }
}
```
