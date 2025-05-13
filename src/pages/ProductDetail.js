import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import Notification from '../components/Notification';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState(null);
  const { addToCart } = useCart();
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: '', comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const products = await api.fetchProducts();
        const foundProduct = products.find(p =>
          (p.id || p.product_id) === parseInt(id)
        );
        if (foundProduct) {
          setProduct({
            ...foundProduct,
            id: foundProduct.id || foundProduct.product_id,
            category: foundProduct.category || foundProduct.category_name,
            price: typeof foundProduct.price === 'string' ? parseFloat(foundProduct.price) : foundProduct.price
          });
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}/reviews`);
        if (res.ok) {
          setReviews(await res.json());
        } else {
          setReviews([]);
        }
      } catch {
        setReviews([]);
      }
    };
    fetchProduct();
    fetchReviews();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity });
      setNotification({
        message: `${product.name} added to cart!`,
        onClose: () => setNotification(null)
      });
    }
  };

  const handleReviewChange = (e) => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          rating: parseInt(reviewForm.rating),
          comment: reviewForm.comment,
        }),
      });
      if (!res.ok) {
        throw new Error('Failed to submit review');
      }
      setReviewForm({ rating: '', comment: '' });
      setNotification({ message: 'Review submitted!', onClose: () => setNotification(null) });
      // Reload reviews
      const updatedReviews = await fetch(`http://localhost:5000/api/products/${id}/reviews`);
      setReviews(await updatedReviews.json());
    } catch (err) {
      setNotification({ message: err.message || 'Failed to submit review', onClose: () => setNotification(null) });
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-6"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 mt-20">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-800 mb-6 flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Products
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-[32rem] object-contain rounded-lg shadow-md bg-gray-100"
              />
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 break-words">{product.name}</h1>
                <p className="text-2xl font-semibold text-blue-600 mt-2">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Category</h2>
                <p className="text-gray-600">{product.category}</p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center space-x-4 mb-6">
                  <label htmlFor="quantity" className="text-gray-700">Quantity:</label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
          {/* Reviews Section */}
          <div className="p-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-gray-500 mb-6">No reviews yet. Be the first to review this product!</p>
            ) : (
              <div className="space-y-4 mb-6">
                {reviews.map((review) => (
                  <div key={review.review_id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-semibold text-gray-800 mr-2">{review.username || 'User'}</span>
                      <span className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-line">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
            <form onSubmit={handleReviewSubmit} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Leave a Review</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <select
                  name="rating"
                  value={reviewForm.rating}
                  onChange={handleReviewChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value="">Select rating</option>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                <textarea
                  name="comment"
                  value={reviewForm.comment}
                  onChange={handleReviewChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={3}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={reviewLoading}
              >
                {reviewLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {notification && <Notification {...notification} />}
    </div>
  );
} 