import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Camera } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Camera size={24} />
          <span className="text-xl font-bold">VirtualTourPro</span>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            {user ? (
              <>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><button onClick={logout}>Logout</button></li>
              </>
            ) : (
              <li><Link to="/auth">Login / Sign Up</Link></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;