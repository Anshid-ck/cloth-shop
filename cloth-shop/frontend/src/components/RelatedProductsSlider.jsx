import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import toast from 'react-hot-toast';
import API from '../api/api';

// Individual product card for the slider
const RelatedProductCard = ({ product }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const wishlistItems = useSelector((state) => state.wishlist.items);

    const isWishlisted = wishlistItems.some((item) => item.id === product.id);

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
            className="flex-shrink-0 w-[220px] sm:w-[240px] lg:w-[260px] cursor-pointer group"
            onClick={() => navigate(`/product/${product.slug}`)}
        >
            <div className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Image Container */}
                <div
                    className="relative aspect-square overflow-hidden"
                    style={{ backgroundColor: product.background_color || '#f5f5f5' }}
                >
                    <img
                        src={product.primary_image || 'https://placehold.co/400x400/f3f4f6/9ca3af?text=No+Image'}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Wishlist Button */}
                    <button
                        onClick={handleWishlist}
                        className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-all"
                    >
                        <Heart
                            size={16}
                            className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                        />
                    </button>

                    {/* Discount Badge */}
                    {product.discount_percentage > 0 && (
                        <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                            {product.discount_percentage}% OFF
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                        {product.brand || product.category_name}
                    </p>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 h-10">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-gray-900">
                            ₹{Math.round(displayPrice)}
                        </span>
                        {product.discount_price && (
                            <span className="text-xs text-gray-400 line-through">
                                ₹{Math.round(product.base_price)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Related Products Slider Component
export default function RelatedProductsSlider({ productSlug }) {
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        if (productSlug) {
            fetchRelatedProducts();
        }
    }, [productSlug]);

    const fetchRelatedProducts = async () => {
        try {
            setLoading(true);
            const response = await API.get(`/products/products/${productSlug}/related/`);
            setRelatedProducts(response.data.results || []);
        } catch (error) {
            console.error('Failed to fetch related products:', error);
            setRelatedProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const updateScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        updateScrollButtons();
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', updateScrollButtons);
            return () => container.removeEventListener('scroll', updateScrollButtons);
        }
    }, [relatedProducts]);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 280; // Card width + gap
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Don't render if no products
    if (!loading && relatedProducts.length === 0) {
        return null;
    }

    return (
        <div className="py-10 border-t border-gray-200">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">You May Also Like</h2>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        className={`p-2 rounded-full border-2 transition-all ${canScrollLeft
                                ? 'border-gray-300 hover:border-black hover:bg-black hover:text-white text-gray-700'
                                : 'border-gray-200 text-gray-300 cursor-not-allowed'
                            }`}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        className={`p-2 rounded-full border-2 transition-all ${canScrollRight
                                ? 'border-gray-300 hover:border-black hover:bg-black hover:text-white text-gray-700'
                                : 'border-gray-200 text-gray-300 cursor-not-allowed'
                            }`}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Products Slider */}
            {loading ? (
                <div className="flex gap-4 overflow-hidden">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex-shrink-0 w-[240px]">
                            <div className="bg-gray-100 rounded-2xl aspect-square animate-pulse" />
                            <div className="mt-3 space-y-2">
                                <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
                                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div
                    ref={scrollContainerRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {relatedProducts.map((product) => (
                        <RelatedProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
