
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";

const Header = () => {
  const { currentUser, userData, logout, canAccessCheckin, canAccessVote, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  
  // Check if we're on the vote page
  const isVotePage = location.pathname === "/vote";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header 
      className={`sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 transition-all duration-300 ease-in-out ${
        isVotePage && !isHovered ? '-translate-y-full' : 'translate-y-0'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/lovable-uploads/fa060889-8e8b-49b9-afa2-2c56adbc0497.png"
                alt="FraserVotes Logo"
                className="h-8 w-auto"
              />
              <span className="font-semibold text-xl">FraserVotes</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {canAccessCheckin() && (
              <Link 
                to="/checkin" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Check-In
              </Link>
            )}
            {canAccessVote() && (
              <Link 
                to="/vote" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Vote
              </Link>
            )}
            {isAdmin() && (
              <Link 
                to="/admin" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Admin
              </Link>
            )}
          </nav>

          {currentUser && (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center">
                <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 mr-2">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || "User"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-full w-full p-1.5 text-gray-500" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">
                    {currentUser.displayName}
                  </span>
                  {userData?.role && (
                    <span className="text-xs text-gray-500 capitalize">
                      {userData.role}
                    </span>
                  )}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Sign Out</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
