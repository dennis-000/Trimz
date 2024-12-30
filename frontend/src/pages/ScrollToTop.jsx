/* eslint-disable react/no-unknown-property */
// ScrollToTop.jsx
import { useState, useEffect } from 'react';
import 'aos/dist/aos.css'; // Import AOS styles
import AOS from 'aos'; // Import AOS library
import { FaArrowUp } from 'react-icons/fa'; // Optional: Use an icon

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    // Toggle visibility of the button based on scroll position
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div>
      {isVisible && (
        <button
          className="scroll-to-top"
          data-aos="fade-up"
          onClick={scrollToTop}
        >
          <FaArrowUp size={20} />
        </button>
      )}
      <style jsx>{`
        .scroll-to-top {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color: #333;
          color: #fff;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: opacity 0.3s, transform 0.3s;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        }
        .scroll-to-top:hover {
          background-color: #555;
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default ScrollToTop;
