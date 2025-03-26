
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Menu, X, LogOut, User, Settings } from 'lucide-react';
import SearchBar from './SearchBar';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Update navbar appearance on scroll
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  // Close mobile menu when clicking a link
  const handleNavigation = () => {
    setMobileMenuOpen(false);
    setShowSearch(false);
  };

  const isHomePage = location.pathname === '/';
  const showOnHomeOnly = isHomePage && !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled || !isHomePage ? 'bg-background/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2" onClick={handleNavigation}>
          <div className="bg-primary rounded-sm p-1">
            <span className="text-white font-bold text-lg">PLEX</span>
          </div>
          <span className={`font-bold text-lg tracking-tight transition-opacity duration-300 ${
            showOnHomeOnly ? 'text-white' : 'text-primary'
          }`}>
            STREAM
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="flex items-center space-x-6">
            <Link 
              to="/browse" 
              className={`transition-colors duration-200 hover:text-accent ${
                showOnHomeOnly ? 'text-white/90 hover:text-white' : 'text-foreground/80 hover:text-foreground'
              }`}
              onClick={handleNavigation}
            >
              Browse
            </Link>
            <Link 
              to="/pricing" 
              className={`transition-colors duration-200 hover:text-accent ${
                showOnHomeOnly ? 'text-white/90 hover:text-white' : 'text-foreground/80 hover:text-foreground'
              }`}
              onClick={handleNavigation}
            >
              Plans
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleSearch}
              className={`p-1 rounded-full transition-colors duration-200 ${
                showOnHomeOnly ? 'text-white/90 hover:text-white' : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              <Search size={20} />
            </button>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt={user?.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/login')}
                  className={showOnHomeOnly ? 'text-white hover:text-white hover:bg-white/10' : ''}
                >
                  Log in
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => navigate('/register')}
                  className={showOnHomeOnly ? 'bg-white text-primary hover:bg-white/90' : ''}
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <X className={showOnHomeOnly ? 'text-white' : 'text-foreground'} />
          ) : (
            <Menu className={showOnHomeOnly ? 'text-white' : 'text-foreground'} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background/95 backdrop-blur-lg shadow-lg slide-down">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link to="/browse" className="py-2" onClick={handleNavigation}>
              Browse
            </Link>
            <Link to="/pricing" className="py-2" onClick={handleNavigation}>
              Plans
            </Link>
            <div className="pt-2">
              <button 
                onClick={() => {
                  toggleSearch();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 py-2"
              >
                <Search size={18} />
                <span>Search</span>
              </button>
            </div>
            {!isAuthenticated && (
              <div className="flex flex-col space-y-3 pt-2">
                <Button variant="outline" onClick={() => navigate('/login')}>
                  Log in
                </Button>
                <Button onClick={() => navigate('/register')}>
                  Sign up
                </Button>
              </div>
            )}
            {isAuthenticated && (
              <div className="flex flex-col space-y-3 pt-2">
                <Button variant="outline" onClick={() => { handleNavigation(); navigate('/profile'); }}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button variant="destructive" onClick={() => { handleNavigation(); logout(); }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {showSearch && (
        <div className="absolute top-16 left-0 w-full bg-background/95 backdrop-blur-lg shadow-lg slide-down">
          <div className="container mx-auto px-4 py-4">
            <SearchBar onClose={toggleSearch} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
