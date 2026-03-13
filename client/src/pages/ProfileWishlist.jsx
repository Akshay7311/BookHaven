import { useState, useEffect } from 'react';
import api from '../services/api';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { HeartCrack } from 'lucide-react';

const ProfileWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/wishlist');
        // Inject isWishlisted flag so BookCard renders filled heart
        const enriched = data.map(b => ({ ...b, isWishlisted: true }));
        setWishlist(enriched);
      } catch (error) {
        console.error('Failed to fetch wishlist');
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  if (loading) return <div className="p-12"><LoadingSpinner /></div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h2>
      
      {wishlist.length === 0 ? (
        <div className="text-center py-16">
          <HeartCrack className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <p className="text-lg font-medium text-gray-900">Your wishlist is empty</p>
          <p className="text-gray-500 mt-1">Save items you like to view them later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileWishlist;
