import { useEffect, useRef, useContext } from 'react'
import logo from "../../assets/images/ecutz.png";

// Importing React Router components for navigation
import { NavLink, Link } from "react-router-dom";
import { BiMenu } from 'react-icons/bi';
import { AuthContext } from '../../context/AuthContext';
// ===============================
// ===============================




// Defining an array of navigation links with their paths and display names
const navLinks = [
  {
    path: '/home',        // Link path to Home page
    display: 'Home'       // Display name for the Home page link
  },
  {
    path: '/barbers',     // Link path to 'Find a Barber' page
    display: 'Find a Barber'   // Display name for the 'Find a Barber' page link
  },
  {
    path: '/services',    // Link path to Services page
    display: 'Services'   // Display name for the Services page link
  },
  {
    path: '/contact',     // Link path to Contact page
    display: 'Contact'    // Display name for the Contact page link
  },
  {
    path: '/aboutus',
    display: 'About Us'
  },
]

// Main Header component
const Header = () => {
  const headerRef = useRef(null)  // Reference to the header element
  const menuRef = useRef(null)    // Reference to the navigation menu (used for mobile view)
  const {user, role, token} = useContext(AuthContext)


  const handleStickyHeader = () => {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
      headerRef.current.classList.add('sticky__header');
    } else {
      headerRef.current.classList.remove('sticky__header');
    }
  };
  
  useEffect(() => {
    const onScroll = () => handleStickyHeader();
    window.addEventListener('scroll', onScroll);
  
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  

  // Function to toggle the visibility of the menu (for mobile view)
  const toggleMenu = () => {
    menuRef.current.classList.toggle('show__menu');
    console.log(menuRef.current.classList); // Debugging to see the class list
  };
  

  return (
    <header className="header flex items-center" ref={headerRef}>  {/* Header with a reference */}
      
      <div className="container">
        <div className="flex items-center justify-between">
          {/* Logo section */}
          <div>
            <Link to="/home" className="flex items-center gap-2">  
            <img src={logo} alt="Ecutz Logo" style={{ width: '70px', height: '70px' }} />  {/* Logo image with fixed width/height */}
            </Link>
          </div>

          {/* Navigation menu section */}
          < div className="navigation" ref={menuRef} onClick={toggleMenu}>
            <ul className='menu flex items-center gap-[2.7rem]'>  {/* Unordered list of navigation links */}
              {/* Map over navLinks array to create list items for each link */}
              {
                navLinks.map((link, index) => 
                  <li key={index}>
                    <NavLink 
                      to={link.path} 
                      className={navClass => navClass.isActive
                        ? 'text-primaryColor text-[16px] leading-7 font-[600]'  // Active link styling
                        : 'text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor'  // Default link styling
                      }
                    >
                      {link.display}  {/* Display link name */}
                    </NavLink>
                  </li>
                )
              }
            </ul>
            
          </div>
         



         {/* =========== Modifying Now for User or Barber Name and Profile ================= */}
          {/* Right section (User profile and login button) */}
          <div className='flex items-center gap-4'>


{token && user ? (
    <div>
        <Link to={`${role === 'provider' ? '/barbers/profile/me' : '/users/profile/me'}`}>
            <figure className="w-[35px] rounded-full cursor-pointer">
                <img 
                    src={user?.profilePicture?.url} 
                    className="w-full rounded-full" alt="User Image" />
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

            {/* user header name */}
            {/* <h1>{user?.name}</h1> */}
            


           

            {/* Menu icon for mobile view */}
            <span className='md:hidden' onClick={toggleMenu}>
              <BiMenu className='w-6 h-6 cursor-pointer'/>  {/* Menu icon */}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
