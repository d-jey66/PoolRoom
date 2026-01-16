import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { MapPin, Phone, Mail, Clock, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Footer() {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [message, setMessage] = useState('');

  const fetchAverageRating = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ratings/average`);
      const data = await res.json();
      setAverageRating(data.average);
      setTotalRatings(data.count);
    } catch (error) {
      console.error('Error fetching average rating:', error);
    }
  };

  const fetchUserRating = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ratings/user`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.rating) {
        setUserRating(data.rating);
        setRating(data.rating);
      }
    } catch (error) {
      console.error('Error fetching user rating:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchAverageRating();
      if (user) {
        await fetchUserRating();
      }
    };
    loadData();
  }, [user]);

  const handleRatingClick = async (value: number) => {
    if (!user) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 3000);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ rating: value }),
      });
      
      if (res.ok) {
        setRating(value);
        setUserRating(value);
        setMessage(userRating ? 'Rating updated!' : 'Thanks for rating!');
        setTimeout(() => setMessage(''), 3000);
        fetchAverageRating();
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      setMessage('Failed to submit rating');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              PoolRoom
            </h3>
            <p className="text-slate-400 text-sm">
              Experience the finest pool tables in town. Premium equipment, great atmosphere.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-slate-100 font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-400 hover:text-purple-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/reservation" className="text-slate-400 hover:text-purple-400 transition-colors text-sm">
                  Book a Table
                </Link>
              </li>
              <li>
                <Link to="/panel" className="text-slate-400 hover:text-purple-400 transition-colors text-sm">
                  My Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-slate-100 font-semibold">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>N 5 მ. ნოზაძის ქუჩა, თბილისი</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+995 598 873 355</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>poolroomofficialg@gmail.com</span>
              </li>
              <li className="flex items-start gap-2 text-slate-400 text-sm">
                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Mon-Sun: 12:00 AM - 2:00 AM</span>
              </li>
            </ul>
          </div>

          {/* Rating */}
          <div className="space-y-4">
            <h4 className="text-slate-100 font-semibold">Rate Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (hoverRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              {averageRating > 0 && (
                <div className="text-sm text-slate-400">
                  <span className="text-yellow-400 font-semibold">{averageRating}</span> / 5
                  <span className="ml-1">({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})</span>
                </div>
              )}

              {showLoginPrompt && (
                <p className="text-xs text-orange-400 animate-pulse">
                  Please login to rate us
                </p>
              )}

              {message && (
                <p className="text-xs text-green-400 animate-pulse">
                  {message}
                </p>
              )}

              {userRating > 0 && (
                <p className="text-xs text-slate-500">
                  You rated: {userRating} stars
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} PoolRoom. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}