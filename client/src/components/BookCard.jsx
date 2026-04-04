import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { notify } from '../utils/toastUtil';

const BookCard = ({ book }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { wishlistCount, toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const inWishlist = isInWishlist(book.id);

  if (!book) return null;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      await addToCart(book.id, 1);
      notify.success('Item added to cart!');
    } catch (error) {
      console.error(error);
      notify.error(error.response?.data?.message || 'Failed to add item to cart.');
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    await toggleWishlist(book.id);
  };

  const handleCardClick = () => {
    navigate(`/books/${book.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full relative cursor-pointer"
    >
      {/* Optional Badge */}
      {book.stock < 10 && book.stock > 0 && (
         <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm z-10">
           Only {book.stock} Left
         </div>
      )}
      {book.stock <= 0 && (
         <div className="absolute top-2 left-2 bg-gray-800 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm z-10">
           Out of Stock
         </div>
      )}

      {/* Wishlist Icon */}
      <button 
        onClick={handleWishlistToggle}
        className={`absolute top-2 right-2 transition-colors z-10 p-1.5 rounded-full shadow-sm hover:scale-110 active:scale-95 ${
            inWishlist 
            ? 'bg-red-50 text-red-500 hover:bg-red-100' 
            : 'bg-white/80 text-gray-300 hover:text-red-500 hover:bg-white'
        }`}
        aria-label="Add to wishlist"
      >
          <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
      </button>

      <div className="block relative pt-[130%] bg-gray-50 overflow-hidden">
        {book.image_url ? (
          <>
             <img 
               src={book.image_url} 
               alt={book.title} 
               className="absolute top-0 left-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 z-10"
             />
             {/* Simulating a secondary image hover effect by slightly zooming and adjusting opacity of a duplicated layer */}
             <div className="absolute top-0 left-0 w-full h-full bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none"></div>
          </>
        ) : (
          <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center">
            <span className="mb-2 text-sm italic">No Cover Available</span>
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-[10px] font-bold text-primary-600 mb-1 uppercase tracking-wider">{book.category}</div>
        <div>
          <h3 className="font-bold text-gray-900 text-[14px] leading-snug mb-1 line-clamp-2 hover:text-primary-600 transition-colors">
            {book.title}
          </h3>
        </div>
        <p className="text-gray-500 text-xs mb-2 italic">by {book.author}</p>
        
        {/* Placeholder Rating (Static for UI as per requirement) */}
        <div className="flex items-center gap-1 mb-3">
             {[1,2,3,4,5].map(star => (
                 <svg key={star} className={`w-3 h-3 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                 </svg>
             ))}
             <span className="text-[10px] text-gray-400 ml-1">({book.id?.toString().substring(0,2) || '42'})</span>
        </div>
        
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 line-through font-medium">₹ {(Number(book.price) * 1.2).toFixed(2)}</span>
            <span className="font-bold text-base text-gray-900 leading-none">
                ₹ {Number(book.price).toFixed(2)}
            </span>
          </div>
          <button 
            onClick={handleAddToCart}
            disabled={book.stock <= 0}
            className={`p-2 rounded-full flex items-center justify-center transition-all ${
              book.stock <= 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow active:scale-95'
            }`}
            title="Add to Cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
