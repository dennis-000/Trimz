import React, { useState } from 'react';
import classicFade from '../../assets/images/classicFade.jpg';
import beardTrimming from '../../assets/images/beardTrimming.jpg';

const BarberGallery = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const images = [
    {
      id: 1,
      url: classicFade,
      caption: 'Classic Fade',
      category: 'Premium Cut'
    },
    {
      id: 2,
      url: beardTrimming,
      caption: 'Precision Beard Trim',
      category: 'Grooming'
    }
  ];

  const openModal = (index) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="w-full bg-zinc-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-zinc-900 mb-2">
            Our Masterpieces
          </h2>
          <p className="text-zinc-600 text-sm max-w-2xl mx-auto">
            Every cut tells a story of precision, style, and excellence
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Feature Image */}
          <div className="col-span-2 row-span-2">
            <div 
              className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md"
              onMouseEnter={() => setHoveredIndex(0)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => openModal(0)}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={images[0].url}
                  alt={images[0].caption}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 ${hoveredIndex === 0 ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute bottom-0 left-0 right-0 p-4 transform transition-transform duration-300">
                  <p className="text-zinc-400 text-xs mb-1">{images[0].category}</p>
                  <h3 className="text-white text-lg font-bold">{images[0].caption}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Smaller Images */}
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md"
              onMouseEnter={() => setHoveredIndex(index + 1)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => openModal(index)}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={image.url}
                  alt={image.caption}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 ${hoveredIndex === index + 1 ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute bottom-0 left-0 right-0 p-3 transform transition-transform duration-300">
                  <p className="text-zinc-400 text-xs mb-1">{image.category}</p>
                  <h3 className="text-white text-sm font-bold">{image.caption}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* See All Works Button */}
        <div className="mt-8 text-center">
          <button className="group relative inline-flex items-center justify-center bg-zinc-900 text-white px-6 py-2 rounded-lg text-sm overflow-hidden transition-all duration-300 hover:bg-zinc-800">
            <span className="relative z-10 text-xs font-medium tracking-wider">
              SEE ALL WORKS
            </span>
            <div className="absolute inset-0 -translate-y-full bg-zinc-700 transition-transform duration-300 group-hover:translate-y-0" />
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="relative w-full max-w-2xl bg-zinc-900 rounded-xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 z-50 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal content */}
            <div className="relative">
              <img
                src={images[currentIndex].url}
                alt={images[currentIndex].caption}
                className="w-full h-auto"
              />
              
              {/* Image info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                <p className="text-zinc-400 text-xs mb-1">{images[currentIndex].category}</p>
                <h3 className="text-white text-lg font-bold">{images[currentIndex].caption}</h3>
              </div>

              {/* Navigation buttons */}
              <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
                  }}
                  className="bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  aria-label="Previous image"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
                  }}
                  className="bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  aria-label="Next image"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarberGallery;