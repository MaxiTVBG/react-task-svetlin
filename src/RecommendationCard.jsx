const truncateString = (str, num) => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
};

const RecommendationCard = ({ product, isWishlisted, onToggleWishlist }) => {
  return (
    <div className="h-full">
      <div className="flex flex-col h-[420px] w-full xl:w-[350px]">
        {product.images && product.images[0] && (
          <div className="relative bg-white p-4 rounded-lg">
            <img
              src={product.images[0].src}
              alt={product.title}
              className="w-full h-64 object-contain"
            />
            <button
              onClick={() => onToggleWishlist(product.id)}
              className="absolute top-2 right-2 bg-white rounded-full p-2 transition-colors duration-200"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={isWishlisted ? 'red' : 'none'}
                xmlns="http://www.w3.org/2000/svg"
                className="transition-fill duration-200"
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
        <div className="p-4 flex flex-col items-center text-center flex-grow justify-end">
          <h3 className="text-lg font-semibold font-bricolage mb-1 h-14 overflow-hidden">
            {truncateString(product.title, 40)}
          </h3>
          <p className="text-gray-900 font-montserrat">
            {product.variants[0]?.price ? `$${product.variants[0].price}` : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
