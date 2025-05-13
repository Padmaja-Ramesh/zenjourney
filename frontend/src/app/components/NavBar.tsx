"use client"
import { useAuth } from '@/app/components/AuthProvider';
import { useState } from 'react';

const NavBar = () => {
  const { user, logOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  return (
    <nav className="relative">
      <ul className="flex space-x-6">
        <li>
          <a href="/" className="hover:text-blue-400 transition-colors">
            Home
          </a>
        </li>
        <li>
          <a href="/about" className="hover:text-blue-400 transition-colors">
            About
          </a>
        </li>
        <li>
          <a href="/contact" className="hover:text-blue-400 transition-colors">
            Contact
          </a>
        </li>
        <li>
          <a href="/voice-agent" className="hover:text-blue-400 transition-colors">
            Agent
          </a>
        </li>

        {/* Avatar and Dropdown */}
        {user ? (
          <li className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              {/* Avatar */}
              <img
                src={user.photoURL || '/default-avatar.png'} // Use Firebase photoURL or fallback image
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
              <span>{user.displayName || 'User'}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10">
                <ul className="text-white">
                  <li>
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-sm hover:bg-gray-700"
                    >
                      Profile
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={logOut}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
                    >
                      Log out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </li>
        ) : (
          <li><a href="/login" className="hover:text-blue-400">Enter the Path</a></li>
          
        )}

        {user?.isAdmin && (
          <li>
            <a href="/admin" className="hover:text-blue-400 transition-colors">
              Admin Dashboard
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
