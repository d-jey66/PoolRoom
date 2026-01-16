import { LayoutDashboard, Calendar, Users, Star, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function AdminSidebar() {
  const location = useLocation();
  
  const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/admin-panel', icon: LayoutDashboard },
    { name: 'Reservations', path: '/admin-panel/reservations', icon: Calendar },
    { name: 'Users', path: '/admin-panel/users', icon: Users },
    { name: 'Ratings', path: '/admin-panel/ratings', icon: Star },
  ];

  const isActive = (path: string): boolean => {
    if (path === '/admin-panel') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Admin Panel
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                active
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Back to Site */}
      <div className="p-4 border-t border-slate-800">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Back to Site</span>
        </Link>
      </div>
    </div>
  );
}