import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';


// New Product Card Component
const ProductCardNew = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.wishlist.items) || [];
  const [quantity, setQuantity] = useState(1);

  const isWishlisted = Array.isArray(wishlistItems) && wishlistItems.some((item) => item.id === product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    dispatch(
      addToCart({
        product_id: product.id,
        quantity,
      })
    );
    setQuantity(1);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      navigate('/login');
      return;
    }

    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const displayPrice = product.discount_price || product.base_price;

  return (
    <div
      className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col cursor-pointer group"
      onClick={() => navigate(`/product/${product.slug}`)}
    >
      {/* Image Container */}
      <div className="relative bg-gray-100 aspect-square overflow-hidden">
        <img
          src={product.primary_image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Wishlist Button - Top Right */}
        <button
          onClick={handleWishlist}
          className="absolute top-4 right-4 bg-white rounded-full p-2.5 shadow-lg hover:shadow-xl transition-all z-10 hover:scale-110"
        >
          <Heart
            size={20}
            className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-300'}
          />
        </button>

        {/* Discount Badge - Top Left */}
        {product.discount_percentage > 0 && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
            {product.discount_percentage}% OFF
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        {/* Brand */}
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
          {product.brand}
        </p>

        {/* Product Name */}
        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 h-9">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-gray-900">
            ₹{Math.round(displayPrice)}
          </span>
          {product.discount_price && (
            <span className="text-sm text-gray-400 line-through">
              ₹{Math.round(product.base_price)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="mb-3">
          {product.total_stock > 10 ? (
            <p className="text-xs font-semibold text-green-600">In Stock</p>
          ) : product.total_stock > 0 ? (
            <p className="text-xs font-semibold text-yellow-600">Low Stock</p>
          ) : (
            <p className="text-xs font-semibold text-red-600">Out of Stock</p>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.total_stock === 0}
          className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white font-bold py-3 rounded-full transition-colors duration-200 text-sm"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default function Shop() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [sortBy, setSortBy] = useState('-created_at');

  const { items: products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    const params = {
      ordering: sortBy,
    };

    const category = searchParams.get('category');
    const searchQuery = searchParams.get('search');

    if (category) {
      // Use category__category_type to filter by category type
      params.category__category_type = category;
    }

    if (searchQuery) {
      // Pass search query to backend
      params.search = searchQuery;
    }

    dispatch(fetchProducts(params));
  }, [dispatch, sortBy, searchParams]);

  const categories = [
    { label: 'All Products', value: null },
    { label: 'Hoodies', value: 'hoodies' },
    { label: 'T-Shirts', value: 'tshirts' },
    { label: 'Pants', value: 'bottomwear' },
    { label: 'Shoes', value: 'shoes' },
    { label: 'Accessories', value: 'accessories' },
  ];


  const productsToShow = products || [];

  return (
    <div className="min-h-screen bg-white pt-32">
      {/* Header Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-8 md:py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Shop
            </h1>
            <p className="text-gray-600 text-lg">
              Discover our premium collection of men's fashion
            </p>
          </div>

          {/* Category Filters & Sorting */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Category Buttons */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => {
                    setSelectedCategory(cat.label);
                    if (cat.value) {
                      navigate(`/shop?category=${cat.value}`);
                    } else {
                      navigate('/shop');
                    }
                  }}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${selectedCategory === cat.label
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="-created_at">Newest</option>
              <option value="base_price">Price: Low to High</option>
              <option value="-base_price">Price: High to Low</option>
              <option value="-rating">Best Rated</option>
            </select>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-gray-300 border-t-black mb-4"></div>
                <p className="text-gray-600 font-medium">Loading products...</p>
              </div>
            </div>
          ) : productsToShow.length > 0 ? (
            <>
              {/* Results Info */}
              <p className="text-sm text-gray-600 mb-6">
                Showing <span className="font-bold text-gray-900">{productsToShow.length}</span> products
              </p>

              {/* Products Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {productsToShow.map((product) => (
                  <ProductCardNew key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination or Load More (Optional) */}
              <div className="flex justify-center mt-12">
                <button className="px-8 py-3 border-2 border-gray-300 rounded-full font-semibold text-gray-900 hover:border-gray-900 transition-all hover:bg-gray-900 hover:text-white">
                  Load More Products
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-32">
              <p className="text-gray-600 text-lg mb-6">No products found</p>
              <button
                onClick={() => navigate('/shop')}
                className="px-8 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition"
              >
                View All Products
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}