// ========== Home.jsx ==========
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ChevronRight, ShoppingBag } from 'lucide-react';
import API from '../api/api';
import toast from 'react-hot-toast';


export default function Home() {
  const navigate = useNavigate();

  const [banners, setBanners] = useState([]);
  const [categoryBanners, setCategoryBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [bottomStyles, setBottomStyles] = useState([]);
  const [mensHoodiesGrid, setMensHoodiesGrid] = useState([]);
  const [jacketsGrid, setJacketsGrid] = useState([]);
  const [promotionalBanners, setPromotionalBanners] = useState([]);
  const [tshirtGrid, setTshirtGrid] = useState([]);
  const [shoesGrid, setShoesGrid] = useState([]);
  const [shoesCard, setShoesCard] = useState([]);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Each request is made safe so it won't crash if endpoint not ready yet
      const [bannersRes, productsRes, categoryBannerRes, bottomRes, hoodiesGridRes, jacketsGridRes, promoBannersRes, tshirtGridRes, shoesGridRes, shoesCardRes] = await Promise.all([
        API.get('/products/banners/').catch(() => ({ data: [] })),
        API.get('/products/products/?is_featured=true').catch(() => ({
          data: { results: [] },
        })),
        API.get('/products/category-cards/').catch(() => ({ data: [] })),
        API.get('products/bottom-styles/').catch(() => ({ data: [] })),
        API.get('/products/mens-hoodie-grid/').catch(() => ({ data: [] })),
        API.get('/products/jackets-grid/').catch(() => ({ data: [] })),
        API.get('/products/promotional-banners/').catch(() => ({ data: [] })),
        API.get('/products/tshirt-grid/').catch(() => ({ data: [] })),
        API.get('/products/shoes-grid/').catch(() => ({ data: [] })),
        API.get('/products/shoes-card/').catch(() => ({ data: [] })),
      ]);

      // Handle both paginated and direct array responses for banners
      const bannerData = bannersRes.data;
      if (Array.isArray(bannerData)) {
        setBanners(bannerData);
      } else if (bannerData && Array.isArray(bannerData.results)) {
        setBanners(bannerData.results);
      } else {
        setBanners([]);
      }
      setProducts(
        Array.isArray(productsRes.data)
          ? productsRes.data
          : productsRes.data?.results || []
      );
      // Handle both array and paginated responses
      const categoryData = categoryBannerRes.data;
      setCategoryBanners(Array.isArray(categoryData) ? categoryData : categoryData?.results || []);

      const bottomData = bottomRes.data;
      setBottomStyles(Array.isArray(bottomData) ? bottomData : bottomData?.results || []);

      const hoodiesData = Array.isArray(hoodiesGridRes.data) ? hoodiesGridRes.data : hoodiesGridRes.data?.results || [];
      setMensHoodiesGrid(hoodiesData);

      const jacketsData = Array.isArray(jacketsGridRes.data) ? jacketsGridRes.data : jacketsGridRes.data?.results || [];
      setJacketsGrid(jacketsData);

      const promoData = Array.isArray(promoBannersRes.data) ? promoBannersRes.data : promoBannersRes.data?.results || [];
      setPromotionalBanners(promoData);

      const tshirtData = Array.isArray(tshirtGridRes.data) ? tshirtGridRes.data : tshirtGridRes.data?.results || [];
      setTshirtGrid(tshirtData);

      const shoesData = Array.isArray(shoesGridRes.data) ? shoesGridRes.data : shoesGridRes.data?.results || [];
      setShoesGrid(shoesData);

      const shoesCardData = Array.isArray(shoesCardRes.data) ? shoesCardRes.data : shoesCardRes.data?.results || [];
      setShoesCard(shoesCardData);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load home data');
    } finally {
      setLoading(false);
    }
  };

  // Use only API data - no demo fallback
  const heroSlides = banners;
  const categoryBlocks = categoryBanners;
  const productsToShow = products?.slice(0, 8) || [];

  return (
    <div className="min-h-screen bg-white">
      {/* ========== HERO SLIDER ========== */}
      <section className="max-w-7xl mx-auto px-4 pt-36">
        {heroSlides.length > 0 && (
          <div className="rounded-3xl overflow-hidden relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
              loop={heroSlides.length > 1}
              className="rounded-3xl overflow-hidden w-full h-[500px] md:h-[450px]"
            >
              {heroSlides.map((slide) => (
                <SwiperSlide key={slide.id || slide.title}>
                  <div
                    className="rounded-3xl overflow-hidden w-full h-full bg-cover bg-center relative"
                    style={{
                      backgroundImage: `url(${slide.image})`,
                    }}
                  >
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

                    {/* Content - positioned left center */}
                    <div className="absolute inset-0 flex items-center">
                      <div className="container mx-auto px-8 md:px-16">
                        <div className="max-w-xl space-y-4 md:space-y-6">
                          {slide.subtitle && (
                            <span className="inline-block text-sm md:text-base font-medium tracking-[0.2em] uppercase text-white/90 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm">
                              {slide.subtitle}
                            </span>
                          )}
                          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight text-white drop-shadow-lg">
                            {slide.title}
                          </h2>
                          {slide.description && (
                            <p className="text-base md:text-lg text-white/90 max-w-md leading-relaxed">
                              {slide.description}
                            </p>
                          )}
                          <button
                            onClick={() =>
                              slide.link ? navigate(slide.link) : navigate('/shop')
                            }
                            className="inline-flex items-center gap-2 px-8 py-3.5 mt-2 text-sm md:text-base font-bold bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                          >
                            <ShoppingBag size={18} />
                            Shop Now
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </section>

      {/* ========== CATEGORY BANNERS (Hoodies / T-Shirts / Pants / Accessories) ========== */}
      <section className=" py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-10 text-left">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Shop by Category
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
            {categoryBlocks.map((item) => (
              <div
                key={item.id || item.title}
                onClick={() => item.link ? navigate(item.link) : navigate('/shop')}
                className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-8 border-white h-100 cursor-pointer"
                style={{ backgroundColor: item.background_color || '#ffffff' }}
              >
                {/* Full Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-contain transform group-hover:scale-110 transition duration-500"
                />

                {/* Text Content Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div>
                    <span className="block text-xs uppercase tracking-[0.15em] text-gray-500 font-medium">
                      Menswear
                    </span>
                    <h3 className="mt-1 text-2xl font-bold text-gray-900">
                      {item.title}
                    </h3>
                  </div>

                  <span
                    className="inline-flex items-center text-sm font-semibold text-gray-900 border-b-2 border-gray-900 pb-0.5 w-max group-hover:translate-x-1 transition"
                  >
                    Shop Now →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ========== SMALL DISCOUNT BANNER ========== */}
      <section className="max-w-7xl mx-auto px-4 py-2">
        <div
          className="bg-gray-900 rounded-xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="bg-amber-500 text-gray-900 font-black text-lg px-3 py-1 rounded">
              ₹100 OFF
            </div>
            <p className="text-white text-sm sm:text-base font-medium">
              On orders above ₹1000 • <span className="text-gray-400">Auto applied at checkout</span>
            </p>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="text-amber-400 hover:text-amber-300 text-sm font-semibold transition whitespace-nowrap"
          >
            Shop Now →
          </button>
        </div>
      </section>

      {/* ========== MEN'S HOODIES GRID SECTION ========== */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Men's Hoodies
        </h2>
        <div className="w-20 h-1 bg-indigo-600 rounded mt-2 mb-10"></div>

        <div className="grid grid-cols-5 grid-rows-5 gap-4 h-[650px]">
          {[1, 2, 3, 4, 5].map((pos) => {
            const item = mensHoodiesGrid.find((g) => g.position === pos);
            if (!item) return null;

            const positionClasses = {
              1: 'col-span-5 row-span-3',
              2: 'row-span-2 row-start-4',
              3: 'row-span-2 row-start-4',
              4: 'row-span-2 row-start-4',
              5: 'col-span-2 row-span-2 row-start-4',
            };

            return (
              <div
                key={item.id || pos}
                className={`${positionClasses[pos]} relative group overflow-hidden rounded-2xl cursor-pointer shadow-lg`}
                onClick={() => navigate(item.link || '/shop')}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <h3 className={`font-bold text-white ${pos === 1 ? 'text-2xl md:text-4xl' : 'text-lg md:text-xl'}`}>
                    {item.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========== PROMOTIONAL BANNER ========== */}
      <section className="max-w-7xl mx-auto px-4 pt-0 pb-6">
        <div className="bg-gray-100 rounded-2xl px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            {/* Left Badge */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-black text-amber-700 tracking-tight">
                GST
              </h3>
              <p className="text-sm font-bold text-gray-700 -mt-1">REDUCTION</p>
              <span className="inline-block mt-1 px-3 py-0.5 bg-amber-600 text-white text-xs font-bold rounded">
                Price Drop Alert!
              </span>
            </div>

            {/* Main Text */}
            <div className="text-center md:text-left flex-1">
              <p className="text-gray-700 text-sm md:text-base font-medium">
                <span className="font-bold text-gray-900">100% GST BENEFIT PASSED</span>
                <br className="md:hidden" />
                {' '}ON EVERY SINGLE PRODUCT, <span className="text-gray-600">AS PER GOVT GUIDELINES.</span>
              </p>
              <button
                onClick={() => navigate('/shop')}
                className="mt-2 text-sm font-semibold text-gray-900 underline underline-offset-2 hover:text-amber-700 transition"
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========== BOTTOMS UP SECTION (ADMIN CONTROLLED) ========== */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Bottoms Up: Style Edition
        </h2>

        <div className="w-20 h-1 bg-amber-500 rounded mt-2 mb-10"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bottomStyles.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(item.link || "/shop")}
              className="cursor-pointer rounded-2xl overflow-hidden shadow-md bg-white"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-80 object-cover"
              />

              <div className="py-3 bg-gray-200 text-center">
                <h3 className="text-xl font-semibold tracking-wide">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== JACKETS GRID SECTION ========== */}
      {jacketsGrid.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Jackets Collection
          </h2>
          <div className="w-20 h-1 bg-amber-500 rounded mt-2 mb-10"></div>

          <div className="grid grid-cols-6 grid-rows-6 gap-3 h-[400px] md:h-[500px]">
            {[1, 2, 3, 4, 5].map((pos) => {
              const item = jacketsGrid.find(g => g.position === pos);
              if (!item) return null;

              // Grid positions based on user's layout
              const gridClasses = {
                1: 'col-span-2 row-span-6',
                2: 'col-span-2 row-span-3 col-start-3',
                3: 'col-span-2 row-span-3 col-start-5',
                4: 'col-span-2 row-span-3 col-start-3 row-start-4',
                5: 'col-span-2 row-span-3 col-start-5 row-start-4',
              };

              return (
                <div
                  key={item.id}
                  onClick={() => navigate(item.link || '/shop?category=jackets')}
                  className={`${gridClasses[pos]} rounded-xl overflow-hidden relative group cursor-pointer shadow-lg hover:shadow-xl transition-shadow`}
                  style={{ backgroundColor: item.background_color || '#ffffff' }}
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  {/* Modern mosaic-style transparent title overlay - bottom center */}
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center md:bottom-4">
                    <div
                      className="relative rounded-full px-5 py-2 md:px-6 md:py-2.5 text-center overflow-hidden"
                      style={{
                        background: `
                          linear-gradient(rgba(128, 128, 128, 0.75), rgba(128, 128, 128, 0.75)),
                          repeating-conic-gradient(
                            from 0deg at 50% 50%,
                            rgba(160, 160, 160, 0.8) 0deg 90deg,
                            rgba(100, 100, 100, 0.8) 90deg 180deg,
                            rgba(160, 160, 160, 0.8) 180deg 270deg,
                            rgba(100, 100, 100, 0.8) 270deg 360deg
                          )
                        `,
                        backgroundSize: '100% 100%, 6px 6px',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -1px 1px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                      }}
                    >
                      <h3 className="font-bold text-white text-sm md:text-base tracking-wide drop-shadow-md">{item.title}</h3>
                      {item.subtitle && <p className="text-white/90 text-xs mt-0.5">{item.subtitle}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ========== PROMOTIONAL IMAGE BANNER SECTION ========== */}
      {promotionalBanners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-6">
          <div className="space-y-6">
            {promotionalBanners.map((banner) => (
              <div
                key={banner.id}
                onClick={() => navigate(banner.button_link || '/shop')}
                className="relative overflow-hidden cursor-pointer group"
              >
                {/* Banner Image */}
                {banner.image && (
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-[300px] md:h-[350px] lg:h-[400px] object-cover"
                  />
                )}

                {/* Text Overlay Inside Image at Bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 py-4 md:py-5 text-center"
                  style={{ backgroundColor: banner.background_color || 'rgba(45, 39, 25, 0.95)' }}
                >
                  <h3
                    className="text-base md:text-lg lg:text-xl font-medium text-white uppercase px-4"
                    style={{ letterSpacing: '0.2em' }}
                  >
                    {banner.title || 'MEET FASHION CLOTHING COLLECTION'}
                  </h3>
                  {banner.subtitle && (
                    <p
                      className="text-xs md:text-sm text-white/70 mt-1 px-4"
                      style={{ letterSpacing: '0.08em' }}
                    >
                      {banner.subtitle}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========== T-SHIRT CAROUSEL SECTION ========== */}
      {tshirtGrid.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            T-Shirts Collection
          </h2>
          <div className="w-20 h-1 bg-indigo-600 rounded mt-2 mb-10"></div>

          <div className="relative tshirt-swiper-container">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={16}
              slidesPerView={1.2}
              centeredSlides={false}
              breakpoints={{
                480: {
                  slidesPerView: 2,
                  spaceBetween: 16,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 24,
                },
              }}
              className="pb-12"
            >
              {tshirtGrid.map((item) => (
                <SwiperSlide key={item.id}>
                  <div
                    onClick={() => navigate(item.link || '/shop?category=tshirts')}
                    className="cursor-pointer group"
                  >
                    {/* Image Container with Title Inside */}
                    <div
                      className="rounded-xl overflow-hidden aspect-[3/4] relative"
                      style={{ backgroundColor: item.background_color || '#ffffff' }}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Title Overlay at Bottom */}
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                        <h3 className="px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-center text-xs md:text-sm font-bold text-white uppercase tracking-wider">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* ========== SHOES SECTION - BANNER STYLE ========== */}
      {shoesGrid.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-6 bg-[#e5e5e5] rounded-2xl">
          {/* Centered Banner Text */}
          <div className="text-center mb-10 px-4">
            <p className="text-sm md:text-base uppercase tracking-[0.2em] text-gray-700 mb-4">
              New Collection
            </p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 italic mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              FASHION FOR EVERY YOU
            </h2>
            <p className="text-base md:text-lg uppercase tracking-[0.4em] text-gray-600">
              Unleash Your Style
            </p>
          </div>

          {/* Image Row */}
          <div className="flex justify-center gap-3 md:gap-4 overflow-x-auto pb-4">
            {shoesGrid.slice(0, 7).map((item, index) => {
              const totalItems = Math.min(shoesGrid.length, 7);
              const isFirst = index === 0;
              const isLast = index === totalItems - 1;
              const tiltStyle = isFirst ? { transform: 'rotate(-6deg)' } : isLast ? { transform: 'rotate(6deg)' } : {};

              return (
                <div
                  key={item.id}
                  onClick={() => navigate(item.link || '/shop?category=shoes')}
                  className="cursor-pointer group flex-shrink-0"
                  style={tiltStyle}
                >
                  {/* Card with rounded corners */}
                  <div
                    className="w-32 md:w-40 lg:w-48 aspect-[3/4] rounded-t-[2rem] rounded-b-lg overflow-hidden p-1.5"
                    style={{ backgroundColor: item.background_color || '#f5f5f5' }}
                  >
                    <div className="w-full h-full rounded-t-[1.75rem] rounded-b-sm overflow-hidden bg-white">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ========== SHOES CARDS - TRENDING SECTION ========== */}
      {shoesCard.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-2">Trending Now</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Step Up Your Style
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {shoesCard.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(item.link || '/shop?category=shoes')}
                className="group cursor-pointer"
              >
                {/* Card Container */}
                <div
                  className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                  style={{ backgroundColor: item.background_color || '#ffffff' }}
                >
                  {/* Image with Gradient Overlay */}
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    {/* Price Badge */}
                    {item.price && (
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                        <span className="text-sm font-bold text-gray-900">{item.price}</span>
                      </div>
                    )}

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                        {item.title}
                      </h3>
                      {item.subtitle && (
                        <p className="text-sm text-white/80">{item.subtitle}</p>
                      )}
                      {/* Shop Now Link */}
                      <div className="mt-3 flex items-center gap-1 text-white/90 text-sm font-medium group-hover:text-white transition-colors">
                        <span>Shop Now</span>
                        <ChevronRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
