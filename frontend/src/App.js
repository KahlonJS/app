import React, { useState, useEffect } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { BookOpen, Sparkles, Library, Loader2, Trash2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Home Page
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-full">
              <BookOpen className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            AI Book Generator
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create amazing books with the power of AI
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              data-testid="generate-book-btn"
              onClick={() => navigate('/generate')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg"
            >
              <Sparkles className="mr-2" />
              Generate New Book
            </Button>
            <Button
              data-testid="my-books-btn"
              onClick={() => navigate('/books')}
              variant="outline"
              className="px-8 py-6 text-lg"
            >
              <Library className="mr-2" />
              My Books
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-purple-600" />
                AI-Powered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Advanced AI technology generates creative and engaging book content tailored to your specifications.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="text-pink-600" />
                Customizable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Choose your book title and page count. The AI adapts to create content that matches your vision.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Library className="text-blue-600" />
                Save & Manage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">All your generated books are saved and easily accessible in your personal library.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Generate Book Page
const GenerateBook = () => {
  const [title, setTitle] = useState('');
  const [pageCount, setPageCount] = useState([10]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast.error('Please enter a book title');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/books/generate`, {
        title: title.trim(),
        page_count: pageCount[0]
      });
      toast.success('Book generated successfully!');
      navigate(`/book/${response.data.id}`);
    } catch (error) {
      console.error('Error generating book:', error);
      toast.error('Failed to generate book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          className="mb-8"
        >
          ← Back to Home
        </Button>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Sparkles className="text-purple-600" />
                Generate Your Book
              </CardTitle>
              <CardDescription>Create an AI-generated book with custom title and length</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Book Title</label>
                <Input
                  data-testid="book-title-input"
                  type="text"
                  placeholder="Enter your book title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Number of Pages: <span className="text-purple-600 font-bold">{pageCount[0]}</span>
                </label>
                <Slider
                  data-testid="page-count-slider"
                  value={pageCount}
                  onValueChange={setPageCount}
                  min={1}
                  max={50}
                  step={1}
                  className="w-full"
                  disabled={loading}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Estimated generation time: ~{Math.ceil(pageCount[0] / 2)} minutes
                </p>
              </div>

              <Button
                data-testid="generate-button"
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" />
                    Generating Your Book...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2" />
                    Generate Book
                  </>
                )}
              </Button>

              {loading && (
                <div className="text-center text-sm text-gray-600">
                  <p>Please wait while AI creates your book...</p>
                  <p className="mt-2">This may take a few minutes depending on the page count.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Books Library Page
const BooksLibrary = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${API}/books`);
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`${API}/books/${bookId}`);
        toast.success('Book deleted successfully');
        fetchBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
        toast.error('Failed to delete book');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
          >
            ← Back to Home
          </Button>
          <Button
            onClick={() => navigate('/generate')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Sparkles className="mr-2" />
            Generate New Book
          </Button>
        </div>

        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
            <Library className="text-purple-600" />
            My Books Library
          </h1>

          {loading ? (
            <div className="text-center py-16">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-purple-600" />
              <p className="mt-4 text-gray-600">Loading your books...</p>
            </div>
          ) : books.length === 0 ? (
            <Card>
              <CardContent className="text-center py-16">
                <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-xl text-gray-600 mb-4">No books yet</p>
                <Button
                  onClick={() => navigate('/generate')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Generate Your First Book
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <Card
                  key={book.id}
                  data-testid={`book-card-${book.id}`}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/book/${book.id}`)}
                >
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{book.title}</CardTitle>
                    <CardDescription>
                      {book.page_count} pages • {new Date(book.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {book.content.substring(0, 150)}...
                    </p>
                    <Button
                      data-testid={`delete-book-${book.id}`}
                      variant="destructive"
                      size="sm"
                      className="mt-4"
                      onClick={(e) => handleDelete(book.id, e)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Book Viewer Page
const BookViewer = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBook();
  }, [bookId]);

  const fetchBook = async () => {
    try {
      const response = await axios.get(`${API}/books/${bookId}`);
      setBook(response.data);
    } catch (error) {
      console.error('Error fetching book:', error);
      toast.error('Failed to load book');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-xl text-gray-600">Book not found</p>
            <Button onClick={() => navigate('/books')} className="mt-4">
              Back to Library
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate('/books')}
          variant="outline"
          className="mb-8"
        >
          ← Back to Library
        </Button>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl" data-testid="book-title">{book.title}</CardTitle>
              <CardDescription>
                {book.page_count} pages • Generated on {new Date(book.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div data-testid="book-content" className="prose max-w-none">
                {book.content.split('\n').map((line, index) => (
                  <p key={index} className="mb-4 whitespace-pre-wrap">
                    {line}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generate" element={<GenerateBook />} />
          <Route path="/books" element={<BooksLibrary />} />
          <Route path="/book/:bookId" element={<BookViewer />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;