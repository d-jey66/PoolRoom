import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Home, LogIn, UserPlus, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../context/AuthContext';
import gsap from 'gsap';


const Logo = '/LogoTab.png'

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, []);

  useEffect(() => {
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.7)', delay: 0.2 }
      );
    }
  }, []);

  useEffect(() => {
    if (linksRef.current) {
      const items = linksRef.current.querySelectorAll('.nav-item');
      gsap.fromTo(
        items,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out', delay: 0.3 }
      );
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getPanelRoute = () => {
    return user?.role === 'admin' ? '/admin-panel' : '/panel';
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav 
      ref={navRef}
      className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" ref={logoRef} className="flex items-center space-x-2 group">
            <img src={Logo} alt="Pool Room Logo" className="w-13 h-13 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Pool Room
            </span>
          </Link>

          <div ref={linksRef} className="hidden md:flex items-center space-x-2">
            <Link to="/" className="nav-item">
              <Button
                variant="ghost"
                className={`flex items-center gap-2 transition-all duration-200 ${
                  isActive('/')
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
            </Link>

            {user ? (
              <>
                <Link to={getPanelRoute()} className="nav-item">
                  <Button
                    variant="ghost"
                    className={`flex items-center gap-2 transition-all duration-200 ${
                      isActive(getPanelRoute())
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    {user.role === 'admin' ? 'Admin Panel' : 'My Profile'}
                  </Button>
                </Link>

                <div className="nav-item flex items-center gap-3 ml-4 pl-4 border-l border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                      {user.fullname?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-slate-300 text-sm">{user.fullname}</span>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-item">
                  <Button
                    variant="ghost"
                    className={`flex items-center gap-2 transition-all duration-200 ${
                      isActive('/login')
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Button>
                </Link>
                <Link to="/signup" className="nav-item">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2 shadow-lg hover:shadow-purple-500/50 transition-all duration-200">
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-300 hover:text-white p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800">
            <div className="flex flex-col space-y-2">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start flex items-center gap-2 ${
                    isActive('/')
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Home
                </Button>
              </Link>

              {user ? (
                <>
                  <Link to={getPanelRoute()} onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start flex items-center gap-2 ${
                        isActive(getPanelRoute())
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      {user.role === 'admin' ? 'Admin Panel' : 'My Panel'}
                    </Button>
                  </Link>

                  <div className="pt-2 border-t border-slate-700">
                    <div className="flex items-center gap-2 px-3 py-2 text-slate-300">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                        {user.fullname?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm">{user.fullname}</span>
                    </div>
                    <Button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      variant="ghost"
                      className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start flex items-center gap-2 ${
                        isActive('/login')
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <LogIn className="w-4 h-4" />
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}