from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Models
class BookGenerate(BaseModel):
    title: str
    page_count: int = Field(ge=1, le=100)

class Book(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    page_count: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BookResponse(BaseModel):
    id: str
    title: str
    content: str
    page_count: int
    created_at: str

# Routes
@api_router.get("/")
async def root():
    return {"message": "AI Book Generation API"}

@api_router.post("/books/generate", response_model=BookResponse)
async def generate_book(book_input: BookGenerate):
    try:
        # Initialize LLM Chat
        chat = LlmChat(
            api_key=os.environ['EMERGENT_LLM_KEY'],
            session_id=str(uuid.uuid4()),
            system_message="You are a creative book author. Write engaging, well-structured book content."
        ).with_model("openai", "gpt-4o-mini")
        
        # Generate book content
        prompt = f"""Write a complete book titled '{book_input.title}' with exactly {book_input.page_count} pages.
        
Each page should be approximately 200-300 words.
Format the output as:

--- Page 1 ---
[Content for page 1]

--- Page 2 ---
[Content for page 2]

...and so on.

Make it engaging, creative, and well-structured."""
        
        user_message = UserMessage(text=prompt)
        content = await chat.send_message(user_message)
        
        # Create book object
        book = Book(
            title=book_input.title,
            content=content,
            page_count=book_input.page_count
        )
        
        # Save to database
        doc = book.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.books.insert_one(doc)
        
        return BookResponse(
            id=book.id,
            title=book.title,
            content=book.content,
            page_count=book.page_count,
            created_at=doc['created_at']
        )
    except Exception as e:
        logging.error(f"Error generating book: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate book: {str(e)}")

@api_router.get("/books", response_model=List[BookResponse])
async def get_books():
    try:
        books = await db.books.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
        return [
            BookResponse(
                id=book['id'],
                title=book['title'],
                content=book['content'],
                page_count=book['page_count'],
                created_at=book['created_at']
            )
            for book in books
        ]
    except Exception as e:
        logging.error(f"Error fetching books: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch books")

@api_router.get("/books/{book_id}", response_model=BookResponse)
async def get_book(book_id: str):
    try:
        book = await db.books.find_one({"id": book_id}, {"_id": 0})
        if not book:
            raise HTTPException(status_code=404, detail="Book not found")
        
        return BookResponse(
            id=book['id'],
            title=book['title'],
            content=book['content'],
            page_count=book['page_count'],
            created_at=book['created_at']
        )
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching book: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch book")

@api_router.delete("/books/{book_id}")
async def delete_book(book_id: str):
    try:
        result = await db.books.delete_one({"id": book_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Book not found")
        return {"message": "Book deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error deleting book: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete book")

# Include the router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()