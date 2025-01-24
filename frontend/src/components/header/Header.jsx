import { useEffect, useRef, useContext, useState } from "react";
import logo from "../../assets/images/ecutz.png";
import { NavLink, Link } from "react-router-dom";
import { BiMenu, BiX, BiHomeAlt, BiStore, BiCog, BiEnvelope, BiInfoCircle } from "react-icons/bi";
import { FaHome } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

const navLinks = [
  {
    path: "/home",
    display: "Home",
    icon: <FaHome className="text-xl" />,
  },
  {
    path: "/barbers",
    display: "MarketPlace",
    icon: <BiStore className="text-xl" />,
  },
  {
    path: "/services",
    display: "Services",
    icon: <BiCog className="text-xl" />,
  },
  {
    path: "/contact",
    display: "Contact",
    icon: <BiEnvelope className="text-xl" />,
  },
  {
    path: "/aboutus",
    display: "About Us",
    icon: <BiInfoCircle className="text-xl" />,
  },
];

const Header = () => {
  const headerRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, role, token } = useContext(AuthContext);

  const handleStickyHeader = () => {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
      headerRef.current.classList.add("sticky__header");
    } else {
      headerRef.current.classList.remove("sticky__header");
    }
  };

  useEffect(() => {
    const onScroll = () => handleStickyHeader();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header flex items-center" ref={headerRef}>
      <div className="container">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div>
            <Link to="/home" className="flex items-center gap-2">
              <img src={logo} alt="Ecutz Logo" style={{ width: "70px", height: "70px" }} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <ul className="menu flex items-center gap-[2.7rem]">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    className={(navClass) =>
                      navClass.isActive
                        ? "text-primaryColor text-[16px] leading-7 font-[600] flex items-center gap-1"
                        : "text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor flex items-center gap-1"
                    }
                  >
                    {link.icon}
                    <span>{link.display}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Right section with profile/login and menu button */}
          <div className="flex items-center gap-4">
            {token && user ? (
              <div>
                <Link to={`${role === "provider" ? "/barbers/profile/me" : "/users/profile/me"}`}>
                  <figure className="w-[35px] rounded-full cursor-pointer">
                    <img
                      src={user?.profilePicture?.url}
                      className="w-full rounded-full"
                      alt="User"
                    />
                  </figure>
                </Link>
              </div>
            ) : (
              <Link to="/login">
                <button className="bg-primaryColor py-6 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]">
                  Login / Register
                </button>
              </Link>
            )}

            {/* Mobile menu button */}
            <span className="md:hidden" onClick={toggleMenu}>
              {isMenuOpen ? (
                <BiX className="w-6 h-6 cursor-pointer" />
              ) : (
                <BiMenu className="w-6 h-6 cursor-pointer" />
              )}
            </span>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-[80px] bg-white shadow-lg z-20">
            <ul className="flex flex-col py-4 px-6">
              {navLinks.map((link, index) => (
                <li key={index} className="border-b border-gray-100 last:border-none">
                  <NavLink
                    to={link.path}
                    className={(navClass) =>
                      navClass.isActive
                        ? "text-primaryColor text-[16px] leading-7 font-[600] flex items-center gap-2 py-3"
                        : "text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor flex items-center gap-2 py-3"
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.icon}
                    <span>{link.display}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
