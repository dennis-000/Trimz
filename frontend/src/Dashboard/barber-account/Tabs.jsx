/* eslint-disable react/prop-types */
import { BiMenu } from 'react-icons/bi';
import { AuthContext } from '../../context/AuthContext';
import { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Tabs = ({ tab, setTab }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const {dispatch} = useContext(AuthContext);
    const navigate = useNavigate();

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        dispatch({type:'LOGOUT'})
        navigate('/login')
    }

    const handleTabClick = (tabName) => {
        setTab(tabName);
        setIsMenuOpen(false);
    }

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'appointments', label: 'Appointments', icon: '📅' },
        { id: 'settings', label: 'Profile', icon: '👤' },
        { id: 'services', label: 'Add Service', icon: '➕' },
        { id: 'galleryupload', label: 'Gallery Upload', icon: '🖼️' },
    ];

    return (
        <div className="relative" ref={menuRef}>
            {/* Mobile Menu Button */}
            <div className='lg:hidden p-2 bg-white rounded-lg shadow-sm'>
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center justify-center w-full gap-2 p-2 transition-colors hover:bg-gray-50 rounded-md"
                >
                    <BiMenu className='w-6 h-6 text-gray-700' />
                    <span className="text-sm font-medium text-gray-700">Menu</span>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className='lg:hidden absolute top-full left-0 w-64 mt-2 bg-white rounded-lg shadow-lg 
                    border border-gray-100 overflow-hidden transform origin-top-right transition-all duration-200 ease-out'
                    style={{ zIndex: 1000 }}
                >
                    <div className="p-4 space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleTabClick(item.id)}
                                className={`
                                    w-full px-4 py-3 rounded-lg text-left transition-all duration-200
                                    flex items-center gap-3 text-sm font-medium
                                    ${tab === item.id 
                                        ? 'bg-indigo-50 text-indigo-600' 
                                        : 'text-gray-700 hover:bg-gray-50'}
                                `}
                            >
                                <span className="text-lg">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                    
                    <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-2">
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium
                                hover:bg-gray-800 transition-colors duration-200"
                        >
                            Logout
                        </button>
                        <button 
                            className="w-full px-4 py-2.5 rounded-lg bg-red-500 text-white text-sm font-medium
                                hover:bg-red-600 transition-colors duration-200"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            )}

            {/* Desktop Menu */}
            <div className='hidden lg:block w-64'>
                <div className='bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden'>
                    <div className="p-4 space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setTab(item.id)}
                                className={`
                                    w-full px-4 py-3 rounded-lg text-left transition-all duration-200
                                    flex items-center gap-3 text-sm font-medium
                                    ${tab === item.id 
                                        ? 'bg-indigo-50 text-indigo-600' 
                                        : 'text-gray-700 hover:bg-gray-50'}
                                `}
                            >
                                <span className="text-lg">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-2">
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium
                                hover:bg-gray-800 transition-colors duration-200"
                        >
                            Logout
                        </button>
                        <button 
                            className="w-full px-4 py-2.5 rounded-lg bg-red-500 text-white text-sm font-medium
                                hover:bg-red-600 transition-colors duration-200"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tabs;