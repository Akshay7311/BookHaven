import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { ChevronRight, ShieldCheck, Truck, Clock, CreditCard, ArrowRight } from 'lucide-react';

const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        // Fetch a random batch for 'Best Sellers' / Featured
        const featuredRes = await api.get(`/books?limit=10`);
        setFeaturedBooks(featuredRes.data.books || []);
        
        // Fetch newest (simulated by a small limit of recent)
        const newRes = await api.get(`/books?limit=5`); // Assuming backend will sort by created_at desc later
        setNewArrivals((newRes.data.books || []).reverse());

        // Fetch Banners
        const bannersRes = await api.get('/banners');
        setBanners(bannersRes.data || []);
      } catch (err) {
        console.error('Error fetching home data:', err);
        setError('Failed to load store data. Please ensure backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Simple Banner Auto-rotation
  useEffect(() => {
      const timer = setInterval(() => {
          setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
      }, 5000);
      return () => clearInterval(timer);
  }, [banners.length]);

  if (loading) return <div className="min-h-screen flex justify-center items-center"><LoadingSpinner /></div>;
  if (error) return <div className="min-h-[50vh] flex flex-col items-center justify-center text-red-600 p-8"><h2 className="text-2xl font-bold mb-2">Error</h2><p>{error}</p></div>;

  const banner = banners[currentBanner];

  return (
    <div className="w-full bg-gray-50 pb-16">
      
      {/* 1. Dynamic Hero Banner Slider */}
      <div className="w-full h-[300px] md:h-[450px] lg:h-[500px] relative overflow-hidden group">
           {banners.length > 0 ? (
               banners.map((b, idx) => (
                   <div 
                      key={b.id} 
                      className={`absolute inset-0 transition-opacity duration-1000 flex items-center ${idx === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'} ${b.color || 'bg-slate-900'}`}
                   >
                       <div className="absolute inset-0 bg-black/40 z-10"></div>
                       <img src={b.image_url} alt={b.title} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay" />
                       
                       <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white pt-10 text-center md:text-left">
                           <span className="inline-block py-1 px-3 rounded text-sm font-bold tracking-wider uppercase mb-4 bg-white/20 backdrop-blur-sm border border-white/30">
                               Featured Highlight
                           </span>
                           <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight shadow-sm max-w-2xl">
                               {b.title || "Discover BookHaven"}
                           </h1>
                           <p className="text-lg md:text-2xl mb-8 max-w-xl text-gray-200 font-medium dropshadow-md">
                               {b.subtitle || "Explore our vast collection and find your next favorite read."}
                           </p>
                           <Link to={b.link_url || "/shop"} className={`inline-flex items-center gap-2 px-8 py-3.5 rounded font-bold text-white transition-colors text-lg ${b.btnColor || 'bg-primary-600 hover:bg-primary-700'}`}>
                               Shop Now <ArrowRight size={20} />
                           </Link>
                       </div>
                   </div>
               ))
           ) : (
               /* Fallback if no banners */
               <div className="absolute inset-0 flex items-center bg-blue-900">
                   <div className="absolute inset-0 bg-black/40 z-10"></div>
                   <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white pt-10">
                       <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight shadow-sm max-w-2xl">
                           Welcome to BookHaven
                       </h1>
                       <p className="text-lg md:text-2xl mb-8 max-w-xl text-gray-200 font-medium dropshadow-md">
                           Your ultimate destination for curated books and literature.
                       </p>
                       <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 rounded font-bold text-white transition-colors text-lg bg-primary-600 hover:bg-primary-700">
                           Start Browsing <ArrowRight size={20} />
                       </Link>
                   </div>
               </div>
           )}

          {/* Banner Controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
              {banners.map((_, idx) => (
                  <button 
                     key={idx} 
                     onClick={() => setCurrentBanner(idx)}
                     className={`w-3 h-3 rounded-full transition-all ${idx === currentBanner ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                  />
              ))}
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-30">
        
        {/* 2. Trust Badges / Why Choose Us */}
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 md:p-8 mb-12 flex flex-wrap justify-center lg:justify-between gap-6">
            <div className="flex items-center gap-4 min-w-[200px]">
                <div className="bg-primary-50 p-3 rounded-full text-primary-600"><Truck size={28} /></div>
                <div>
                    <h4 className="font-bold text-gray-900 text-sm">Free Delivery</h4>
                    <p className="text-xs text-gray-500">Orders over ₹999</p>
                </div>
            </div>
            <div className="flex items-center gap-4 min-w-[200px]">
                <div className="bg-primary-50 p-3 rounded-full text-primary-600"><ShieldCheck size={28} /></div>
                <div>
                    <h4 className="font-bold text-gray-900 text-sm">Secure Payment</h4>
                    <p className="text-xs text-gray-500">100% secure checkout</p>
                </div>
            </div>
            <div className="flex items-center gap-4 min-w-[200px]">
                <div className="bg-primary-50 p-3 rounded-full text-primary-600"><Clock size={28} /></div>
                <div>
                    <h4 className="font-bold text-gray-900 text-sm">24/7 Support</h4>
                    <p className="text-xs text-gray-500">Dedicated help center</p>
                </div>
            </div>
            <div className="flex items-center gap-4 min-w-[200px]">
                <div className="bg-primary-50 p-3 rounded-full text-primary-600"><CreditCard size={28} /></div>
                <div>
                    <h4 className="font-bold text-gray-900 text-sm">Easy Returns</h4>
                    <p className="text-xs text-gray-500">7-day return policy</p>
                </div>
            </div>
        </div>

        {/* 3. Featured Categories (Visual) */}
        <section className="mb-16">
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-primary-500 pb-1 inline-block">Explore Categories</h2>
                <Link to="/shop" className="text-sm font-semibold text-primary-600 hover:text-primary-800 flex items-center">View All <ChevronRight size={16}/></Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    {name: "Fiction", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop", color: "from-purple-900/80"},
                    {name: "Web Novel", img: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop", color: "from-blue-900/80"},
                    {name: "History", img: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=600&auto=format&fit=crop", color: "from-amber-900/80"},
                    {name: "Science", img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600&auto=format&fit=crop", color: "from-emerald-900/80"}
                ].map(cat => (
                     <Link key={cat.name} to={`/shop?category=${cat.name}`} className="relative h-40 rounded-lg overflow-hidden group shadow-sm border border-gray-200">
                         <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                         <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} to-transparent opacity-80 group-hover:opacity-90 transition-opacity`}></div>
                         <h3 className="absolute bottom-4 left-4 text-white font-bold text-lg">{cat.name}</h3>
                     </Link>
                ))}
            </div>
        </section>

        {/* 4. Best Sellers Carousel / Grid */}
        <section className="mb-16">
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-primary-500 pb-1 inline-block">Best Sellers</h2>
                <Link to="/shop?sort=popular" className="text-sm font-semibold text-primary-600 hover:text-primary-800 flex items-center">View All <ChevronRight size={16}/></Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {featuredBooks.slice(0, 5).map(book => (
                    <BookCard key={book.id} book={book} />
                ))}
            </div>
        </section>

        {/* Promotional Banner (Middle) */}
        <div className="bg-emerald-900 rounded-xl p-8 mb-16 text-white flex flex-col md:flex-row items-center justify-between shadow-xl relative overflow-hidden pattern-dots">
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
             <div className="relative z-10 max-w-lg mb-6 md:mb-0">
                 <h3 className="text-3xl font-extrabold mb-2">Heritage Collection</h3>
                 <p className="text-emerald-100 text-lg mb-6">Discover ancient knowledge. Get flat 15% off classic literature using code <span className="font-mono bg-emerald-800 px-2 py-1 rounded text-white font-bold tracking-widest border border-emerald-600">MYTH15</span></p>
                 <Link to="/shop?category=History" className="bg-white text-emerald-900 px-6 py-2.5 rounded font-bold hover:bg-emerald-50 transition-colors inline-block">Explore Classics</Link>
             </div>
             <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
                 <img src="/deal-book.png" alt="Ancient Heritage Book" className="w-56 h-56 object-cover rounded-2xl shadow-2xl border-2 border-emerald-700/50" />
             </div>
        </div>

        {/* 5. New Arrivals */}
        <section className="mb-16">
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-primary-500 pb-1 inline-block">New Arrivals</h2>
                <Link to="/shop?sort=newest" className="text-sm font-semibold text-primary-600 hover:text-primary-800 flex items-center">View All <ChevronRight size={16}/></Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {newArrivals.map(book => (
                    <BookCard key={book.id} book={book} />
                ))}
            </div>
        </section>

        {/* 6. Newsletter Subscription */}
        <div className="bg-white border text-center border-gray-200 rounded-xl p-8 md:p-12 shadow-sm max-w-4xl mx-auto">
             <h3 className="text-2xl font-bold text-gray-900 mb-2">Subscribe to our Newsletter</h3>
             <p className="text-gray-500 mb-8 max-w-md mx-auto">Get the latest updates on new arrivals, exclusive discounts, and special offers delivered to your inbox.</p>
             <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto" onSubmit={(e) => { e.preventDefault(); alert('Subscribed!')}}>
                 <input type="email" placeholder="Your email address" required className="flex-grow px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 text-sm" />
                 <button type="submit" className="bg-primary-600 text-white font-bold px-6 py-3 rounded hover:bg-primary-700 transition-colors whitespace-nowrap">Subscribe</button>
             </form>
        </div>

      </div>
    </div>
  );
};

export default Home;
