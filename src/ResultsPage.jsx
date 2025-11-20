import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoutineSlider from './RoutineSlider';

const getFilteredProducts = (products, answers) => {
  const answerValues = Object.values(answers);

  if (answerValues.length === 0) {
    return products.slice(0, 3);
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
    return products.slice(0, 3); // Fallback products
  }

  return relevantProducts;
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

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading products...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen">Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative bg-black/40 bg-blend-multiply bg-cover bg-center bg-no-repeat min-h-[539px] flex flex-col items-center justify-center p-8 text-white" style={{ backgroundImage: "url('/assets/ba1b5feec77ec1fc9d27c36047d092f5787f5336.webp')" }}>
        <div className="max-w-xl text-center">
          <h2 className="text-4xl font-semibold font-bricolage mb-8">
            Build you everyday self care routine.
          </h2>
          <p className="font-montserrat mb-8">
            Perfect for if you're looking for soft, nourished skin, our moisturizing body washes are made with skin-natural
            nutrients that work with your skin to replenish moisture. With a light formula, the bubbly lather leaves your
            skin feeling cleansed and cared for. And by choosing relaxing fragrances you can add a moment of calm to the
            end of your day.
          </p>
          <button
            onClick={handleRetakeQuiz}
            className="w-60 h-12 rounded-lg border border-white transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-sky-300 font-bold"
          >
            Retake Quiz
          </button>
        </div>
      </div>
      <div className="relative max-w-6xl mx-auto -mt-10 sm:-mt-20 z-10 p-4">
        <RoutineSlider products={products} wishlist={wishlist} toggleWishlist={toggleWishlist} />

      </div>
    </div>
  );
}

export default ResultsPage;
