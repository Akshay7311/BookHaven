import { Link } from 'react-router-dom';
import { BookOpen, MapPin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="text-primary-500" size={28} />
              <span className="font-extrabold text-2xl tracking-tight text-white">BookHaven</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              India's premier destination for epic fantasies, web novels, manga, and classic literature. High-quality physical prints delivered right to your doorstep.
            </p>
          </div>

          <div>
             <h3 className="font-bold text-lg mb-4 text-gray-100 uppercase tracking-widest text-xs">Explore</h3>
             <ul className="space-y-3">
               <li><Link to="/" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Home</Link></li>
               <li><Link to="/about" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">About Us</Link></li>
               <li><Link to="/contact" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Contact Us</Link></li>
             </ul>
          </div>

          <div>
             <h3 className="font-bold text-lg mb-4 text-gray-100 uppercase tracking-widest text-xs">Legal & Services</h3>
             <ul className="space-y-3">
               <li><Link to="/faq" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">FAQ</Link></li>
               <li><Link to="/shipping" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Shipping Policy</Link></li>
               <li><Link to="/terms" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Terms of Service</Link></li>
               <li><Link to="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Privacy Policy</Link></li>
             </ul>
          </div>

          <div className="space-y-4">
             <h3 className="font-bold text-lg mb-4 text-gray-100 uppercase tracking-widest text-xs">Get in Touch</h3>
             <div className="flex items-start gap-3 text-gray-400 text-sm">
               <MapPin size={18} className="text-primary-500 mt-0.5 flex-shrink-0" />
               <p>123 Literature Ave, Sector 4, Gandhinagar, Gujarat 382004</p>
             </div>
             <div className="flex items-center gap-3 text-gray-400 text-sm">
               <Phone size={18} className="text-primary-500 flex-shrink-0" />
               <p>+91 9510108864</p>
             </div>
             <div className="flex items-center gap-3 text-gray-400 text-sm">
               <Mail size={18} className="text-primary-500 flex-shrink-0" />
               <p>support@indianbookstore.com</p>
             </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 gap-4">
           <p>&copy; {new Date().getFullYear()} BookHaven. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
