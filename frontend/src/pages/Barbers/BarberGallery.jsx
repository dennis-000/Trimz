/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

const BarberGallery = ({ gallery }) => {
  const INITIAL_DISPLAY_COUNT = 8;
  
  const [images, setImages] = useState(gallery || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);

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

  const handleShowMore = () => {
    setDisplayCount(prev => prev + INITIAL_DISPLAY_COUNT);
  };

  // Function to get random offset classes
  const getRandomOffset = (index) => {
    const offsets = [
      'translate-y-4',
      '-translate-y-4',
      'translate-x-4',
      '-translate-x-4',
      'translate-y-8',
      '-translate-y-8',
      'translate-x-0',
      'translate-y-0'
    ];
    return offsets[index % offsets.length];
  };

  // Function to get random rotation
  const getRandomRotation = (index) => {
    const rotations = [
      'rotate-2',
      '-rotate-2',
      'rotate-1',
      '-rotate-1',
      'rotate-0'
    ];
    return rotations[index % rotations.length];
  };

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-4 border-zinc-600 border-t-transparent rounded-full"></div></div>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="w-full bg-zinc-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-zinc-900 mb-2">Our Masterpieces</h2>
          <p className="text-zinc-600 text-sm max-w-2xl mx-auto">
            Every style tells a story of precision, style, and excellence
          </p>
        </div>

        {/* Scattered Gallery Grid */}
        <div className="relative">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {images.slice(0, displayCount).map((image, index) => (
              <div
                key={image._id || index}
                className={`group relative cursor-pointer transition-all duration-500 ease-out
                  ${getRandomOffset(index)} ${getRandomRotation(index)}
                  hover:-translate-y-1 hover:rotate-0 hover:z-10`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => openModal(index)}
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg bg-white p-2">
                  <div className="aspect-square overflow-hidden rounded-md">
                    <img
                      src={image.url}
                      alt={image.caption}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent 
                        transition-opacity duration-300 ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}`}
                    >
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-zinc-300 text-xs mb-0.5">{image.category}</p>
                        <h3 className="text-white text-sm font-medium">{image.caption}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Show More Button */}
        {images.length > displayCount && (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleShowMore}
              className="px-6 py-2 bg-zinc-900 text-white text-sm rounded-full hover:bg-zinc-800 
                transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Show More
            </button>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div
              className="relative w-full max-w-3xl bg-zinc-900 rounded-lg overflow-hidden shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 z-50 bg-black/50 hover:bg-black/70 text-white w-8 h-8 
                  rounded-full flex items-center justify-center transition-all duration-200"
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
                  <p className="text-zinc-300 text-xs mb-1">{images[currentIndex].category}</p>
                  <h3 className="text-white text-base font-bold">{images[currentIndex].caption}</h3>
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