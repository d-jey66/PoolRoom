import { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Calendar, Clock, MapPin, Phone, Mail, Star, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VipImage = '/vip.png';
const NormalImage = '/normal.png';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const tablesRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Payment success handler
  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
      // Clear the URL parameter after showing message
      setTimeout(() => {
        setSearchParams({});
      }, 5000);
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    // Hero animation
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.querySelector('.hero-content'),
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );
    }

    // About section animation
    if (aboutRef.current) {
      gsap.fromTo(
        aboutRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: aboutRef.current,
            start: 'top 80%',
          }
        }
      );
    }

    // tables animation
    if (tablesRef.current) {
      const cards = tablesRef.current.querySelectorAll('.table-card');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          scrollTrigger: {
            trigger: tablesRef.current,
            start: 'top 80%',
          }
        }
      );
    }

    // Map animation
    if (mapRef.current) {
      gsap.fromTo(
        mapRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: mapRef.current,
            start: 'top 80%',
          }
        }
      );
    }
  }, []);

  const tables = [
    {
      id: 2,
      name: 'Standard Table',
      image: NormalImage,
      description: 'Classic 8ft table perfect for casual games',
      features: ['Quality felt surface', 'Standard equipment', 'Great for beginners']
    },
    {
      id: 3,
      name: 'VIP Lounge Table',
      image: VipImage,
      description: 'Private area with premium table and seating',
      features: ['Private space', 'Bottle service', 'Exclusive atmosphere']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {searchParams.get('payment') === 'success' && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
          <Alert className="bg-green-900/90 border-green-700 text-green-100 shadow-2xl max-w-md">
            <CheckCircle className="h-5 w-5" />
            <AlertDescription className="ml-2">
              Payment successful! Your reservation is confirmed. Check your email for details.
            </AlertDescription>
          </Alert>
        </div>
      )}
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1599685315659-bc876da49fe5?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Pool table"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-purple-900/70"></div>
        </div>

        <div className="hero-content relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Welcome to PoolRoom
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Experience the finest pool tables in town. Premium equipment, great atmosphere, and unforgettable nights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/reservation">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg shadow-2xl hover:shadow-purple-500/50 transition-all duration-300">
                <Calendar className="w-5 h-5 mr-2" />
                Book a Table
              </Button>
            </Link>
            <a href="#about">
              <Button variant="outline" className="border-slate-600 text-slate-600 hover:bg-slate-800 px-8 py-6 text-lg">
                Learn More
              </Button>
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-slate-500 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-slate-500 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" ref={aboutRef} className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Why Choose Pool Room?
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              We offer the best pool experience with premium tables, professional equipment, and a vibrant atmosphere.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-slate-900/50 border-slate-800 hover:border-purple-500/50 transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-slate-100">Premium Tables</CardTitle>
                <CardDescription className="text-slate-400">
                  Tournament-grade tables with championship cloth for the perfect game
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800 hover:border-purple-500/50 transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-slate-100">Flexible Hours</CardTitle>
                <CardDescription className="text-slate-400">
                  Open daily from 12 AM to 2 AM. Book your preferred time slot easily online
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800 hover:border-purple-500/50 transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-slate-100">Great Location</CardTitle>
                <CardDescription className="text-slate-400">
                  Located in the heart of downtown with easy parking and public transport access
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Tables Section */}
      <section ref={tablesRef} className="py-20 px-4 bg-slate-950/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Our Tables
            </h2>
            <p className="text-slate-400 text-lg">
              Choose from our selection of premium pool tables
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {tables.map((table) => (
              <div
                key={table.id}
                className="table-card bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden hover:border-purple-500/50 transition-all duration-300 group"
              >
                <div className="relative h-76 overflow-hidden">
                  <img
                    src={table.image}
                    alt={table.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-slate-100 text-2xl font-semibold mb-2">{table.name}</h3>
                  <p className="text-slate-400 text-base mb-4">
                    {table.description}
                  </p>
                  <ul className="space-y-2">
                    {table.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-slate-300 text-sm">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section ref={mapRef} className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Visit Us
            </h2>
            <p className="text-slate-400 text-lg">
              Find us in the heart of downtown
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-slate-900/50 border-slate-800 overflow-hidden h-full">
              <CardContent className="p-0 h-full min-h-[400px]">
                <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11898.963784330546!2d44.81873111800316!3d41.790796294379426!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40446dc042c0140b%3A0xc561c578ea64e145!2z4YOe4YOj4YOaIOGDoOGDo-GDm-GDmA!5e0!3m2!1ska!2sge!4v1767799520113!5m2!1ska!2sge" width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen
                loading="lazy"
                className="grayscale hover:grayscale-0 transition-all duration-500"></iframe>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-100 mb-4">Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-slate-100 font-semibold mb-1">Address</h3>
                    <p className="text-slate-400">
                      N 5 მ. ნოზაძის ქუჩა, თბილისი
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-slate-100 font-semibold mb-1">Phone</h3>
                    <p className="text-slate-400">+995 598 873 355</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-slate-100 font-semibold mb-1">Email</h3>
                    <p className="text-slate-400">poolroomofficialg@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-slate-100 font-semibold mb-1">Opening Hours</h3>
                    <p className="text-slate-400">
                      Monday - Sunday<br />
                      12:00 AM - 2:00 AM
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-br from-blue-600 to-purple-600 border-0 shadow-2xl">
            <CardContent className="py-16 px-8">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Play?
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                Book your table now and enjoy an unforgettable pool experience. Premium tables are waiting for you!
              </p>
              <Link to="/reservation">
                <Button className="bg-white text-purple-600 hover:bg-slate-100 px-8 py-6 text-lg font-semibold shadow-xl">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Your Table Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}