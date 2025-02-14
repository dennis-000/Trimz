/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { BASE_URL } from '../../config';

const BarberGallery = ({ gallery }) => {
  // Ensure we always have an array for images
  const [images, setImages] = useState(gallery || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // When the gallery prop changes, update the images state and set loading to false
  useEffect(() => {
    setImages(gallery || []);
    setLoading(false);
  }, [gallery]);

  const openModal = (index) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  if (loading) return <p className="text-center text-zinc-600">Loading images...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="w-full bg-zinc-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-zinc-900 mb-2">Our Masterpieces</h2>
          <p className="text-zinc-600 text-sm max-w-2xl mx-auto">
            Every style tells a story of precision, style, and excellence
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {images.map((image, index) => (
            <div
              key={image._id || index} // Use image._id if available; fallback to index
              className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => openModal(index)}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={image.url} // Dynamically load image
                  alt={image.caption}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 ${
                  hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="absolute bottom-0 left-0 right-0 p-3 transform transition-transform duration-300">
                  <p className="text-zinc-400 text-xs mb-1">{image.category}</p>
                  <h3 className="text-white text-sm font-bold">{image.caption}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div
              className="relative w-full max-w-2xl bg-zinc-900 rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 z-50 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                aria-label="Close modal"
              >
                ✕
              </button>
              <div className="relative">
                <img
                  src={`${images[currentIndex].url}`}
                  alt={images[currentIndex].caption}
                  className="w-full h-auto"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                  <p className="text-zinc-400 text-xs mb-1">{images[currentIndex].category}</p>
                  <h3 className="text-white text-lg font-bold">{images[currentIndex].caption}</h3>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarberGallery;