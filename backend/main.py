from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse, HTMLResponse, JSONResponse
import os
from routes.date_routes import router as date_router
from routes.auth_routes import router as auth_router
from routes.external_api_routes import router as external_api_router
from middleware import SecurityHeadersMiddleware

# Get frontend URL from environment variables
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

app = FastAPI(
    title="LoveLink '89 API",
    description="Romantic Date Generator with API-first flow",
    version="2.0"
)

# Configure CORS - include all necessary origins
origins = [
    FRONTEND_URL,
    "http://localhost:3000",
    "http://localhost:8000",
    "http://localhost:8080",
    "http://127.0.0.1:8080",  # Add this for local development
    "https://09e0-2601-c2-1f00-f180-f0bd-5094-64f8-f051.ngrok-free.app",
    "https://sensible-deeply-ray.ngrok-free.app",
    # Add your Supabase URL if needed for authentication redirects
    os.getenv("SUPABASE_URL", "")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Use specific origins when allow_credentials is True
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept", "X-Requested-With"],
    expose_headers=["Content-Type", "Authorization"],
    max_age=600  # Cache preflight requests for 10 minutes
)

# Add security headers middleware
app.add_middleware(SecurityHeadersMiddleware)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    return RedirectResponse(url="/static/login.html")

@app.get("/debug")
async def debug():
    return JSONResponse({"status": "API is running", "message": "If you see this, the API is working correctly"})

@app.get("/test-html", response_class=HTMLResponse)
async def test_html():
    return """
    <!DOCTYPE html>
    <html>
        <head>
            <title>Test Page</title>
        </head>
        <body>
            <h1>Test Page</h1>
            <p>If you can see this, HTML rendering is working correctly.</p>
            <p><a href="/static/login.html">Go to Login Page</a></p>
        </body>
    </html>
    """

app.include_router(date_router, prefix="/api")
app.include_router(auth_router, prefix="/api/auth", tags=["authentication"])
app.include_router(external_api_router, prefix="/api", tags=["external-apis"])