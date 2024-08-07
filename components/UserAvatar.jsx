import { useState } from 'react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { toast } from 'react-toastify';

const UserAvatar = ({ user }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/' });
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button 
        onClick={toggleDropdown}
        className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold focus:outline-none"
      >
        {user.image ? (
          <Image 
            src={user.image} 
            alt="User Avatar" 
            width={40} 
            height={40} 
            className="rounded-full"
          />
        ) : (
          user.name ? user.name[0].toUpperCase() : 'U'
        )}
      </button>
      {showDropdown && (
        <div className="absolute bottom-12 left-0 bg-white rounded-md shadow-lg py-2 w-32">
          <button 
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;