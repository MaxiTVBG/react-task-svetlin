import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './ResultsPage.css';

const DEFAULT_PRODUCTS_COUNT = 3;

const getFilteredProducts = (products, answers) => {
  const answerValues = Object.values(answers);

  if (answerValues.length === 0) {
    return products.slice(0, DEFAULT_PRODUCTS_COUNT);
  }

  const keywords = answerValues.map((answer) => answer.replace(/_/g, ' '));

  const scoredProducts = products.map((product) => {
    let score = 0;
    const title = product.title.toLowerCase();
    const tags = (product.tags || []).map((t) => (typeof t === 'string' ? t.toLowerCase() : ''));
    const productType = (product.product_type || '').toLowerCase();

    keywords.forEach((keyword) => {
      if (title.includes(keyword)) {
        score += 2; // Higher weight for title
      }
      if (productType.includes(keyword)) {
        score += 1;
      }
      if (tags.some((tag) => tag.includes(keyword))) {
        score += 1;
      }
    });
    return { ...product, score };
  });

  const relevantProducts = scoredProducts.filter((p) => p.score > 0);
  relevantProducts.sort((a, b) => b.score - a.score);

  if (relevantProducts.length === 0) {
    return products.slice(0, DEFAULT_PRODUCTS_COUNT); // Fallback products
  }

  return relevantProducts;
};

const truncateString = (str, num) => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
};

const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-slick-arrow`}
      style={{
        ...style,
        display: 'flex',
        background: '#EEF7FB',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        top: '50%',
        transform: 'translateY(-50%)',
      }}
      onClick={onClick}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 12L10 8L6 4" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-slick-arrow`}
      style={{
        ...style,
        display: 'flex',
        background: '#EEF7FB',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        top: '50%',
        transform: 'translateY(-50%)',
      }}
      onClick={onClick}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 12L6 8L10 4" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

function ResultsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  useEffect(() => {
    const fetchAndFilterProducts = async () => {
      try {
        const response = await fetch('https://jeval.com.au/collections/hair-care/products.json?page=1');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const savedAnswers = localStorage.getItem('quizAnswers');
        const answers = savedAnswers ? JSON.parse(savedAnswers) : {};

        const filtered = getFilteredProducts(data.products, answers);

        const sortedProducts = [...filtered].sort((a, b) => {
          const aInWishlist = wishlist.includes(a.id);
          const bInWishlist = wishlist.includes(b.id);
          if (aInWishlist && !bInWishlist) return -1;
          if (!aInWishlist && bInWishlist) return 1;
          return 0;
        });

        setProducts(sortedProducts);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterProducts();
  }, [wishlist]);

  const toggleWishlist = (productId) => {
    const newWishlist = wishlist.includes(productId)
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };

  const handleRetakeQuiz = () => {
    localStorage.removeItem('quizAnswers');
    navigate('/');
  };

  const availableSlides = 1 + products.length;

  const settings = {
    dots: true,
    infinite: availableSlides > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    vertical: false,
    verticalSwiping: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: availableSlides > 2,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          vertical: false,
          verticalSwiping: false,
          dots: true,
          infinite: availableSlides > 1,
          swipeToSlide: true,
        },
      },
    ],
  };

  if (loading) {
    return <div className="results-page-container">Loading products...</div>;
  }

  if (error) {
    return <div className="results-page-container">Error: {error.message}</div>;
  }

  return (
    <div className="main-results-wrapper relative min-h-screen">
      <div className="results-page-container w-screen min-h-[539px] bg-[url('/src/assets/ba1b5feec77ec1fc9d27c36047d092f5787f5336.jpg')] bg-cover bg-center bg-no-repeat bg-black/40 bg-blend-multiply flex flex-col items-center p-8">
        <div className="results-content-wrapper max-w-[583px] mt-8 mx-auto  flex flex-col items-center justify-around p-8 text-white text-center">
          <h2 className="font-bricolage font-semibold text-[40px] leading-[110%] tracking-normal text-center mb-8">
            Build you everyday self care routine.
          </h2>
          <p className="font-montserrat font-normal not-italic text-[16px] leading-[150%] tracking-normal text-center mb-8">
            Perfect for if you're looking for soft, nourished skin, our moisturizing body washes are made with skin-natural
            nutrients that work with your skin to replenish moisture. With a light formula, the bubbly lather leaves your
            skin feeling cleansed and cared for. And by choosing relaxing fragrances you can add a moment of calm to the
            end of your day.
          </p>
          <button
            onClick={handleRetakeQuiz}
            className="retake-quiz-button text-white font-bold w-[238px] h-[47px] rounded-lg border border-[#FFFFFF] flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-sky-300"
          >
            Retake Quiz
          </button>        </div>
      </div>
      <div className="z-10 w-full max-w-[1122px] mx-auto md:mt-[-79px] mt-8 relative px-4">
        <Slider {...settings}>
          <div className="w-[350px] h-[420px] px-[18px]">
            <div className="w-full rounded-lg opacity-100 bg-[#EEF7FB] border border-gray-200 shadow-md p-4 flex flex-col justify-center min-h-[420px]">
              <h3 className="font-bricolage font-semibold text-[24px] leading-[110%] tracking-[0%] text-center mb-2 text-gray-800">
                Daily routine
              </h3>
              <p className="font-montserrat font-normal text-[16px] leading-[150%] tracking-[0%] text-center mb-2 text-gray-900">
                Perfect for if you're looking for soft, nourished skin, our moisturizing body washes are made with
                skin-natural nutrients that work with your skin to replenish moisture. With a light formula, the bubbly
                lather leaves your skin feeling cleansed and cared for. And by choosing relaxing fragrances you can add a
                moment of calm to the end of your day.
              </p>
            </div>
          </div>
          {products.map((product) => (
            <div key={product.id} className="px-[18px]">
              <div className="w-full h-[420px] opacity-100 flex flex-col justify-between relative">
                {product.images && product.images[0] && (
                  <div className="relative bg-white rounded-t-lg">
                    <img
                      src={product.images[0].src}
                      alt={product.title}
                      className="w-full max-h-[345px] h-[345px] object-contain rounded-md "
                    />
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="wishlist-heart absolute top-2 right-2 bg-white rounded-full p-2"
                      style={{ transition: 'all 0.2s ease-in-out' }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill={wishlist.includes(product.id) ? 'red' : 'none'}
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ transition: 'fill 0.2s ease-in-out' }}
                      >
                        <path
                          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                          stroke="#000"
                          strokeWidth="2"
                        />
                      </svg>
                    </button>
                  </div>
                )}
                <div className="w-full flex flex-col items-center mx-auto pt-2 p-4">
                  <h3 className="w-full h-[25.5px] overflow-hidden font-bricolage text-[24px] font-semibold leading-[110%] text-center mb-1 text-gray-800">
                    {truncateString(product.title, 24)}
                  </h3>
                  <p className="font-montserrat text-center m-h-[25.5px] text-lg text-gray-900 mb-1">
                    {product.variants[0]?.price ? `$${product.variants[0].price}` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default ResultsPage;