import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import BookCard from '../components/BookCard';
import { notify } from '../utils/toastUtil';
import { ShoppingCart, ArrowLeft, Heart, Share2, Star, CheckCircle, Truck, Info, MessageSquare, ShieldCheck } from 'lucide-react';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImage, setActiveImage] = useState(0);
  
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Real gallery images from backend associations
  const galleryImages = [
    book?.image_url, 
    ...(book?.images ? book.images.map(img => img.imageUrl) : [])
  ].filter(Boolean);

  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchBookAndRelated = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/books/${id}`);
        setBook(data);
        setError(null);
        setReviews(data.reviews || []);

        // Fetch related books from same category
        if (data.category) {
            const relatedRes = await api.get(`/books?category=${data.categoryId || data.category}&limit=5`);
            const booksArray = Array.isArray(relatedRes.data) ? relatedRes.data : relatedRes.data.books || [];
            if (booksArray.length > 0) {
                 setRelatedBooks(booksArray.filter(b => b.id !== data.id));
            } else {
                 setRelatedBooks([]);
            }
        }

      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch book details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookAndRelated();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(book.id, qty);
      notify.success('Added to cart!');
    } catch (error) {
      notify.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleWishlistAdd = async () => {
      if (!user) return navigate('/login');
      try {
          const res = await api.post('/wishlist/toggle', { bookId: book.id });
          notify.success(res.data.message || 'Wishlist updated!');
      } catch (err) {
          notify.error('Failed to update wishlist');
      }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (!reviewComment) return notify.error('Please add a comment');

    try {
      setSubmittingReview(true);
      const { data } = await api.post('/api/reviews', {
        bookId: id,
        rating: reviewRating,
        comment: reviewComment
      });
      notify.success('Review submitted!');
      setReviews([data.review, ...reviews]);
      setReviewComment('');
      setReviewRating(5);
    } catch (err) {
      notify.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="min-h-screen pt-20"><LoadingSpinner /></div>;
  
  if (error) return (
    <div className="max-w-7xl mx-auto px-4 py-12 text-center min-h-[50vh] flex flex-col justify-center items-center">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Book Not Found</h2>
      <p className="text-red-500 mb-8 max-w-md">{error}</p>
      <Link to="/shop" className="bg-primary-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-700 transition flex items-center justify-center gap-2">
        <ArrowLeft size={18} /> Return to Shop
      </Link>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            
            {/* Breadcrumb Navigation */}
            <nav className="flex text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                        <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
                    </li>
                    <li><div className="flex items-center"><span className="mx-2">/</span>
                        <Link to="/shop" className="hover:text-primary-600 transition-colors">Shop</Link>
                    </div></li>
                    <li><div className="flex items-center"><span className="mx-2">/</span>
                        <Link to={`/shop?category=${book.category}`} className="hover:text-primary-600 transition-colors">{book.category || 'Books'}</Link>
                    </div></li>
                    <li aria-current="page"><div className="flex items-center"><span className="mx-2">/</span>
                        <span className="text-gray-800 font-medium truncate max-w-[200px]">{book.title}</span>
                    </div></li>
                </ol>
            </nav>

            {/* Main Product Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    
                    {/* Left: Gallery (Thumbnail Strip + Main Image) */}
                    <div className="lg:col-span-5 p-6 lg:border-r border-gray-100 flex flex-col-reverse sm:flex-row gap-4">
                        {/* Thumbnails */}
                        <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible w-full sm:w-20 flex-shrink-0">
                            {galleryImages.map((imgUrl, idx) => (
                                <button 
                                   key={idx} 
                                   onClick={() => setActiveImage(idx)}
                                   className={`w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${activeImage === idx ? 'border-primary-500 ring-2 ring-primary-100' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    <img src={imgUrl} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                            {galleryImages.length === 0 && (
                                <div className="w-16 h-20 sm:w-20 sm:h-24 bg-gray-100 rounded-lg border-2 border-primary-500 ring-2 ring-primary-100"></div>
                            )}
                        </div>
                        
                        {/* Main Image Zoom View */}
                        <div className="flex-1 bg-gray-50 rounded-xl flex items-center justify-center p-4 relative group overflow-hidden min-h-[400px]">
                            {galleryImages.length > 0 ? (
                                <img 
                                    src={galleryImages[activeImage]} 
                                    alt={book.title} 
                                    className="max-h-[500px] w-auto object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.15] cursor-zoom-in"
                                />
                            ) : (
                                <div className="text-gray-400 font-medium flex flex-col items-center">
                                    <div className="w-16 h-16 mb-2 opacity-50 bg-gray-200 rounded flex items-center justify-center">No Cover</div>
                                    No Image Available
                                </div>
                            )}
                            <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md text-gray-500 hover:text-primary-600 transition-colors">
                                <Share2 size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Right: Product Info & Buy Box */}
                    <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col">
                        <div className="mb-4 flex flex-wrap gap-2">
                           {book.category && (
                               <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-primary-100">
                                   {book.category}
                               </span>
                           )}
                           <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold tracking-wider">
                               SKU: BH-{book.id.substring(0,6).toUpperCase()}
                           </span>
                        </div>
                        
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-2 leading-tight tracking-tight">
                            {book.title}
                        </h1>
                        
                        <p className="text-xl text-primary-600 mb-4 font-medium flex items-center gap-2">
                             Author: <span className="text-gray-800">{book.author}</span>
                        </p>

                        {/* Ratings Strip */}
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                            <div className="flex items-center">
                                {[1,2,3,4,5].map(star => (
                                    <Star key={star} size={18} className={star <= (book.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"} />
                                ))}
                                <span className="text-sm font-bold text-gray-700 ml-2">{book.rating || '0.0'}</span>
                            </div>
                            <span className="text-gray-300">|</span>
                            <span className="text-sm text-gray-500 hover:text-primary-600 cursor-pointer">{book.numReviews || 0} Reviews</span>
                        </div>
                        
                        {/* Price & Stock */}
                        <div className="flex items-end gap-4 mb-4">
                            <div className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
                                ₹{Number(book.price).toFixed(2)}
                            </div>
                            <div className="text-lg text-gray-400 line-through mb-1 font-medium">
                                ₹{(Number(book.price) * 1.3).toFixed(2)}
                            </div>
                            <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-sm font-bold mb-2 ml-2">
                                Save 30%
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-8">
                             {book.stock > 0 ? (
                                 <>
                                    <CheckCircle size={20} className="text-green-500" />
                                    <span className="font-bold text-green-600">In Stock</span>
                                    <span className="text-gray-500 text-sm ml-1">({book.stock} units ready to ship)</span>
                                 </>
                             ) : (
                                 <span className="font-bold text-red-500 bg-red-50 px-3 py-1 rounded border border-red-100">Temporarily Out of Stock</span>
                             )}
                        </div>
                        
                        <div className="prose prose-sm text-gray-600 mb-8 max-w-none line-clamp-3">
                            <p>{book.description || 'Dive into this amazing story. More description details are available in the tabs below.'}</p>
                        </div>

                        {/* Action Box */}
                        <div className="mt-auto bg-gray-50 p-6 rounded-xl border border-gray-200">
                            {book.stock > 0 ? (
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div className="flex items-center border border-gray-300 bg-white rounded-lg h-14 w-full sm:w-32">
                                        <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 text-gray-500 hover:text-primary-600 h-full font-bold text-lg">-</button>
                                        <input type="number" readOnly value={qty} className="w-full text-center font-bold text-gray-900 border-none outline-none bg-transparent" />
                                        <button onClick={() => setQty(Math.min(book.stock, qty + 1))} className="px-4 text-gray-500 hover:text-primary-600 h-full font-bold text-lg">+</button>
                                    </div>
                                    
                                    <button 
                                        onClick={handleAddToCart}
                                        className="flex-grow w-full bg-primary-600 hover:bg-primary-700 text-white flex justify-center items-center gap-2 h-14 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                                    >
                                        <ShoppingCart size={22} />
                                        Add to Cart
                                    </button>
                                    
                                    <button 
                                       onClick={handleWishlistAdd}
                                       className="w-full sm:w-16 h-14 flex items-center justify-center bg-white border border-gray-300 rounded-lg text-gray-600 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors shadow-sm"
                                       title="Add to Wishlist"
                                    >
                                        <Heart size={24} />
                                    </button>
                                </div>
                            ) : (
                                <button disabled className="w-full bg-gray-300 text-gray-500 flex justify-center items-center h-14 rounded-lg font-bold text-lg cursor-not-allowed">
                                    Out of Stock
                                </button>
                            )}

                            {/* Trust badges */}
                            <div className="flex items-center justify-center sm:justify-start gap-6 mt-6 pt-6 border-t border-gray-200">
                                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                    <Truck size={18} className="text-primary-500" /> Free Dispatch
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                    <ShieldCheck size={18} className="text-primary-500" /> Secure Terms
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Information Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-16">
                <div className="flex border-b border-gray-200 overflow-x-auto hide-scrollbar">
                    <button 
                       onClick={() => setActiveTab('description')}
                       className={`px-8 py-5 text-sm sm:text-base font-bold whitespace-nowrap flex items-center gap-2 transition-colors ${activeTab === 'description' ? 'text-primary-600 border-b-4 border-primary-500 bg-primary-50/50' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
                    >
                        <Info size={18} /> Book Overview
                    </button>
                    <button 
                       onClick={() => setActiveTab('reviews')}
                       className={`px-8 py-5 text-sm sm:text-base font-bold whitespace-nowrap flex items-center gap-2 transition-colors ${activeTab === 'reviews' ? 'text-primary-600 border-b-4 border-primary-500 bg-primary-50/50' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
                    >
                        <MessageSquare size={18} /> Customer Reviews ({book.numReviews || 0})
                    </button>
                    <button 
                       onClick={() => setActiveTab('shipping')}
                       className={`px-8 py-5 text-sm sm:text-base font-bold whitespace-nowrap flex items-center gap-2 transition-colors ${activeTab === 'shipping' ? 'text-primary-600 border-b-4 border-primary-500 bg-primary-50/50' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
                    >
                        <Truck size={18} /> Delivery & Returns
                    </button>
                </div>
                
                <div className="p-8 lg:p-10">
                    {activeTab === 'description' && (
                         <div className="prose max-w-4xl text-gray-700 leading-relaxed">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">About {book.title}</h3>
                            <p>{book.description || 'No detailed description was provided for this item.'}</p>
                            <p className="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                         </div>
                    )}
                    
                    {activeTab === 'reviews' && (
                        <div className="max-w-4xl">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                                Customer Ratings
                            </h3>

                            {/* Review Form */}
                            {user ? (
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
                                    <h4 className="font-bold text-gray-900 mb-4">Write a Review</h4>
                                    <form onSubmit={handleReviewSubmit}>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                            <div className="flex gap-1">
                                                {[1,2,3,4,5].map(star => (
                                                    <button 
                                                        key={star} 
                                                        type="button"
                                                        onClick={() => setReviewRating(star)}
                                                        className="text-yellow-400 focus:outline-none"
                                                    >
                                                        <Star size={24} className={star <= reviewRating ? "fill-current" : "text-gray-300"} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                                            <textarea 
                                                value={reviewComment}
                                                onChange={(e) => setReviewComment(e.target.value)}
                                                placeholder="Share your thoughts about this book..."
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                                rows="3"
                                            ></textarea>
                                        </div>
                                        <button 
                                            type="submit" 
                                            disabled={submittingReview}
                                            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-700 transition disabled:opacity-50"
                                        >
                                            {submittingReview ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 mb-8 text-center text-gray-500">
                                    Please <Link to="/login" className="text-primary-600 font-bold hover:underline">login</Link> to write a review.
                                </div>
                            )}

                            {/* Reviews List */}
                            <div className="space-y-4">
                                {reviews.length > 0 ? (
                                    reviews.slice(0, 5).map((review) => (
                                        <div key={review.id} className="border border-gray-100 bg-gray-50 rounded-xl p-6 relative">
                                            <span className="absolute top-4 right-4 text-xs text-gray-400">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center font-bold text-primary-700 uppercase">
                                                    {review.userName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">{review.userName}</p>
                                                    <div className="flex text-yellow-400">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={12} className={i < review.rating ? "fill-current" : "text-gray-300"} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                                    </div>
                                )}
                                {reviews.length > 5 && (
                                    <p className="text-center text-sm text-gray-400 mt-4 italic">Showing the 5 most recent reviews.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'shipping' && (
                        <div className="max-w-3xl space-y-6">
                            <div className="flex gap-4">
                                <div className="bg-primary-50 p-4 rounded-full h-fit"><Truck className="text-primary-600" size={24} /></div>
                                <div>
                                    <h4 className="font-bold text-lg text-gray-900 mb-1">Free Delivery Framework</h4>
                                    <p className="text-gray-600 text-sm leading-relaxed">We provide free standard shipping across India on all orders over ₹999. Standard delivery takes 3-5 business days. Express overnight shipping is available at an additional layout cost during checkout.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-red-50 p-4 rounded-full h-fit"><ShieldCheck className="text-red-500" size={24} /></div>
                                <div>
                                    <h4 className="font-bold text-lg text-gray-900 mb-1">Replacement Guarantee</h4>
                                    <p className="text-gray-600 text-sm leading-relaxed">If you receive a physically damaged product, we offer a strict 7-day replacement window. Please initiate the request from your Order History dashboard.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Related Books Slider / Grid */}
            {relatedBooks.length > 0 && (
                <section>
                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-primary-500 pb-1 inline-block">More like this</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {relatedBooks.map((relatedBook) => (
                            <BookCard key={relatedBook.id} book={relatedBook} />
                        ))}
                    </div>
                </section>
            )}

        </div>
    </div>
  );
};

export default BookDetails;
