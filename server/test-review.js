import api from '../client/src/services/api.js'; // This won't work in node directly easily due to axios config
// I'll use a simpler script for node
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

async function testReview() {
  try {
    // 1. Login to get token
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'user@example.com',
      password: 'bookhaven123'
    });
    const token = loginRes.data.token;
    console.log('Logged in successfully');

    // 2. Get a book ID
    const booksRes = await axios.get(`${API_URL}/books`);
    const bookId = booksRes.data.books[0].id;
    console.log(`Testing with Book ID: ${bookId}`);

    // 3. Add a review
    const reviewRes = await axios.post(`${API_URL}/reviews`, {
      bookId,
      rating: 5,
      comment: 'This is a test review for verification.'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Review added:', reviewRes.data.message);

    // 4. Get book details and verify review stats
    const detailRes = await axios.get(`${API_URL}/books/${bookId}`);
    console.log('Book Rating:', detailRes.data.rating);
    console.log('Number of Reviews:', detailRes.data.numReviews);
    console.log('First Review Comment:', detailRes.data.reviews[0].comment);

    if (detailRes.data.numReviews === 1 && detailRes.data.rating === '5.0') {
      console.log('VERIFICATION SUCCESSFUL');
    } else {
      console.log('VERIFICATION FAILED: Stats mismatch');
    }

  } catch (err) {
    console.error('Test Failed:', err.response?.data || err.message);
  }
}

testReview();
