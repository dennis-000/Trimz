import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { RiLinkedinFill } from 'react-icons/ri';
import { AiFillYoutube, AiOutlineInstagram } from 'react-icons/ai';

const socialLinks = [
  {
    path: "#",
    icon: <AiFillYoutube className="group-hover:text-white w-4 h-4 sm:w-5 sm:h-5" />,
  },
  {
    path: "https://www.instagram.com/ecutzhairsaloon?igsh=NXR3NTAyaTJqMmNr&utm_source=qr",
    icon: <AiOutlineInstagram className="group-hover:text-white w-4 h-4 sm:w-5 sm:h-5" />,
  },
  {
    path: "#",
    icon: <RiLinkedinFill className="group-hover:text-white w-4 h-4 sm:w-5 sm:h-5" />,
  },
];

const quickLinks01 = [
  { path: "/home", display: "Home" },
  { path: "/barbers", display: "Marketplace" },
  { path: "/services", display: "Services" },
  { path: "/aboutus", display: "About Us" },
  { path: "/", display: "Blog" },
];

const quickLinks02 = [
  { path: "/barbers", display: "Find a Barber" },
  { path: "/", display: "Find a location" },
  { path: "/", display: "Get a Opinion" },
];

const quickLinks03 = [
  { path: "/", display: "Donate" },
  { path: "/contact", display: "Contact Us" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-[#CDF0F3] to-[#FFF5DF]">
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          {/* Logo and social section */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-4">
            <div className="mb-4 sm:mb-6">
              <img src={logo} alt="zeal logo" className="h-8 sm:h-10 lg:h-12 mb-2 sm:mb-4" />
              <p className="text-xs sm:text-sm text-textColor leading-relaxed mb-3 sm:mb-6 line-clamp-3 sm:line-clamp-none">
                We&apos;re committed to providing exceptional barbering services and creating a welcoming community for all our clients.
              </p>
              <div className="flex gap-2 sm:gap-4">
                {socialLinks.map((link, index) => (
                  <Link
                    to={link.path}
                    key={index}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#181A1E] flex items-center justify-center transition-all duration-300 group hover:bg-primaryColor hover:border-none"
                  >
                    {link.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 sm:col-span-1 lg:col-span-3">
            <h2 className="text-sm sm:text-base lg:text-lg font-bold text-headingColor mb-2 sm:mb-4">
              Quick Links
            </h2>
            <ul className="space-y-1 sm:space-y-2">
              {quickLinks01.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="text-xs sm:text-sm text-textColor hover:text-primaryColor transition-colors duration-300"
                  >
                    {item.display}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* I want to section */}
          <div className="col-span-1 sm:col-span-1 lg:col-span-3">
            <h2 className="text-sm sm:text-base lg:text-lg font-bold text-headingColor mb-2 sm:mb-4">
              I want to:
            </h2>
            <ul className="space-y-1 sm:space-y-2">
              {quickLinks02.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="text-xs sm:text-sm text-textColor hover:text-primaryColor transition-colors duration-300"
                  >
                    {item.display}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support section */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-2">
            <h2 className="text-sm sm:text-base lg:text-lg font-bold text-headingColor mb-2 sm:mb-4">
              Support
            </h2>
            <ul className="space-y-1 sm:space-y-2">
              {quickLinks03.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="text-xs sm:text-sm text-textColor hover:text-primaryColor transition-colors duration-300"
                  >
                    {item.display}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal Links Section */}
        <div className="border-t border-gray-200 mt-6 sm:mt-8 lg:mt-12 pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-xs sm:text-sm text-textColor">
              Copyright © {year} developed by Zeal Craft Innovation. All rights reserved.
            </p>
            <div className="flex items-center space-x-3 sm:space-x-6">
              <Link 
                to="/privacy-policy" 
                className="text-xs sm:text-sm text-textColor hover:text-primaryColor transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <span className="text-textColor">•</span>
              <Link 
                to="/terms-conditions" 
                className="text-xs sm:text-sm text-textColor hover:text-primaryColor transition-colors duration-300"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;