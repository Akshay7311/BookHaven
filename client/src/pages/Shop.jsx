import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Filter, BookOpen, Star, ArrowDownAZ, ArrowUpZA, ArrowDown10, ArrowUp01, Grid, List } from 'lucide-react';

const Shop = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL Params parsing
  const keywordParam = searchParams.get('keyword') || '';
  const categoryParam = searchParams.get('category') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  
  // Local State
  const [keyword, setKeyword] = useState(keywordParam);
  const [debouncedKeyword, setDebouncedKeyword] = useState(keywordParam);
  const [category, setCategory] = useState(categoryParam);
  const [sort, setSort] = useState(sortParam);
  const [viewMode, setViewMode] = useState('grid');
  
  // Mock advanced filters (For UI representation as per Phase 3 scope)
  const [priceRange, setPriceRange] = useState(5000);
  const [inStockOnly, setInStockOnly] = useState(false);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
        setDebouncedKeyword(keyword);
    }, 500);
    return () => clearTimeout(timer);
  }, [keyword]);

  // Sync params when state changes
  useEffect(() => {
     const params = {};
     if (debouncedKeyword) params.keyword = debouncedKeyword;
     if (category) params.category = category;
     if (sort !== 'newest') params.sort = sort;
     setSearchParams(params, { replace: true });
  }, [debouncedKeyword, category, sort, setSearchParams]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        // We aren't fully passing advanced mock filters to API since backend doesn't support them all, 
        // but we will apply the ones it does and filter the rest locally for the demonstration.
        const { data } = await api.get(`/books?keyword=${debouncedKeyword}&category=${category}&limit=200`);
        
        // Local secondary filtering & sorting mock to fulfill UI requirements
        let results = data.books || [];
        
        if (inStockOnly) results = results.filter(b => b.stock > 0);
        results = results.filter(b => Number(b.price) <= priceRange);
        
        if (sort === 'price_asc') results.sort((a,b) => Number(a.price) - Number(b.price));
        if (sort === 'price_desc') results.sort((a,b) => Number(b.price) - Number(a.price));
        if (sort === 'oldest') results.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
        // 'newest' / popular implicitly handled or default from API.

        setBooks(results);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to load books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [debouncedKeyword, category, sort, inStockOnly, priceRange]); // Re-fetch or re-filter when dependencies change

  const clearFilters = () => {
    setKeyword('');
    setDebouncedKeyword('');
    setCategory('');
    setSort('newest');
    setPriceRange(5000);
    setInStockOnly(false);
    setSearchParams({});
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full bg-gray-50 min-h-screen">
      
      {/* Breadcrumb / Title Bar */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white px-6 py-4 rounded-xl border border-gray-200 shadow-sm">
         <div>
            <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <BookOpen className="text-primary-500" size={24} />
            {category ? `${categories.find(c => c.id === category)?.name || 'Filtered'} Collection` : (debouncedKeyword ? `Search: "${debouncedKeyword}"` : 'All Books')}
            </h1>
            <p className="text-sm text-gray-500 mt-1">Showing {books.length} results</p>
         </div>

         {/* Top Format Controls */}
         <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}>
                    <Grid size={18} />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow text-primary-600' : 'text-gray-500 hover:text-gray-700'} pointer-events-none opacity-50`} title="List view coming soon">
                    <List size={18} />
                </button>
            </div>
            
            <div className="relative">
                <select 
                   value={sort} 
                   onChange={(e) => setSort(e.target.value)}
                   className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium cursor-pointer"
                >
                    <option value="newest">Sort by: Newest Arrivals</option>
                    <option value="popular">Sort by: Popularity</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                </select>
                <ArrowDownAZ size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
         </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Advanced Sidebar Filters */}
        <div className="w-full md:w-64 lg:w-72 flex-shrink-0">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 sticky top-24">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-lg">
                    <Filter size={20} className="text-primary-600" />
                    <h3>Filters</h3>
                </div>
                <button onClick={clearFilters} className="text-[10px] uppercase font-bold text-primary-600 hover:text-primary-800 transition-colors bg-primary-50 px-2 py-1 rounded">Reset</button>
            </div>
            
            {/* Category Filter */}
            <div className="mb-6">
                <h4 className="font-bold text-gray-900 mb-3 text-sm">Categories</h4>
                <ul className="space-y-1">
                <li>
                    <button 
                    onClick={() => setCategory('')}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${category === '' ? 'bg-primary-50 text-primary-700 font-bold border-l-4 border-primary-500' : 'text-gray-600 hover:bg-gray-50 font-medium border-l-4 border-transparent'}`}
                    >
                    All Books
                    </button>
                </li>
                {categories.map(cat => (
                    <li key={cat.id}>
                    <button 
                        onClick={() => setCategory(cat.id)}
                        className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${category === cat.id ? 'bg-primary-50 text-primary-700 font-bold border-l-4 border-primary-500' : 'text-gray-600 hover:bg-gray-50 font-medium border-l-4 border-transparent'}`}
                    >
                        {cat.name}
                    </button>
                    </li>
                ))}
                </ul>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6 border-t border-gray-100 pt-6">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-gray-900 text-sm">Max Price</h4>
                    <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">₹{priceRange}</span>
                </div>
                <input 
                    type="range" 
                    min="100" 
                    max="5000" 
                    step="100"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                    <span>₹100</span>
                    <span>₹5000+</span>
                </div>
            </div>

            {/* Availability Filter */}
            <div className="mb-6 border-t border-gray-100 pt-6">
                <h4 className="font-bold text-gray-900 mb-3 text-sm">Availability</h4>
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                        <input 
                           type="checkbox" 
                           checked={inStockOnly}
                           onChange={(e) => setInStockOnly(e.target.checked)}
                           className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border ${inStockOnly ? 'bg-primary-600 border-primary-600' : 'bg-white border-gray-300 group-hover:border-primary-400'} flex items-center justify-center transition-colors`}>
                            {inStockOnly && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                        </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">In Stock Only</span>
                </label>
            </div>

            {/* Mock Ratings Filter */}
            <div className="border-t border-gray-100 pt-6">
                <h4 className="font-bold text-gray-900 mb-3 text-sm">Customer Rating</h4>
                <div className="space-y-2">
                    {[4,3,2].map(rating => (
                        <label key={rating} className="flex items-center gap-2 cursor-pointer group opacity-60">
                            <input type="radio" name="rating" disabled className="sr-only" />
                            <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} className={i < rating ? "text-yellow-400 fill-current" : "text-gray-300"} />
                                ))}
                            </div>
                            <span className="text-xs text-gray-500 ml-1">& Up</span>
                        </label>
                    ))}
                    <p className="text-[10px] text-gray-400 italic mt-2">*Rating filter visual only</p>
                </div>
            </div>

          </div>
        </div>

        {/* Main Grid Content */}
        <div className="flex-1">
          {loading ? (
             <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-100 text-center shadow-sm">
                <p className="font-semibold text-lg">{error}</p>
            </div>
          ) : books.length === 0 ? (
             <div className="bg-white p-16 rounded-xl border border-gray-200 text-center shadow-sm flex flex-col items-center">
                 <div className="bg-gray-50 p-6 rounded-full text-gray-300 mb-4"><Search size={48} /></div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                 <p className="text-gray-500 max-w-md">We couldn't find any books matching your current filters. Try broadening your search or resetting the filters.</p>
                 <button onClick={clearFilters} className="mt-8 px-6 py-3 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-colors shadow-sm">Clear All Filters</button>
             </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
