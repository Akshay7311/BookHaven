import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Users, BookOpen } from 'lucide-react';
import api from '../services/api';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await api.post('/contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
       setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl font-black tracking-tight text-gray-900 sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500">
            Get In Touch
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Have a question about a book, an order, or just want to say hello? 
            Our team is here to help you navigate your next great read.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Info Side */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-primary-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden group flex-1">
              {/* Decorative background element */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary-800 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
              <div className="absolute -left-10 -top-10 w-40 h-40 bg-primary-700 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>

              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-10 border-b border-primary-800 pb-4 inline-block">Contact Info</h2>
                
                <div className="space-y-10">
                  <div className="flex items-start gap-6 group/item">
                    <div className="p-3 bg-primary-800 rounded-xl group-hover/item:bg-primary-700 transition-colors">
                      <MapPin className="text-primary-300" size={28} />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-2 text-primary-50">Our Location</h3>
                      <p className="text-primary-100/90 leading-relaxed text-lg">
                        123 Literature Avenue<br/>
                        Sector 4, Gandhinagar<br/>
                        Gujarat, India 382004
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-6 group/item">
                    <div className="p-3 bg-primary-800 rounded-xl group-hover/item:bg-primary-700 transition-colors">
                      <Phone className="text-primary-300" size={28} />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-2 text-primary-50">Call Us</h3>
                      <p className="text-primary-100/90 text-lg font-medium">+91 9510108864</p>
                      <p className="text-primary-300/60 text-sm mt-1 font-normal italic">Mon-Sat, 9am - 7pm IST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group/item">
                    <div className="p-3 bg-primary-800 rounded-xl group-hover/item:bg-primary-700 transition-colors">
                      <Mail className="text-primary-300" size={28} />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-2 text-primary-50">Email Support</h3>
                      <a href="mailto:support@bookhaven.com" className="text-primary-100/90 text-lg hover:text-white transition-colors block">
                        support@bookhaven.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Minimal card for extra info */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-gray-900">Follow Our Journey</h4>
                    <p className="text-gray-500 text-sm">Updates on new arrivals & events</p>
                </div>
                <div className="flex gap-3 text-primary-600">
                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center hover:bg-primary-100 cursor-pointer transition-colors">
                        <Users size={18} />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center hover:bg-primary-100 cursor-pointer transition-colors">
                        <BookOpen size={18} />
                    </div>
                </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 relative h-full">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                Send a Message
                <span className="h-1 w-12 bg-primary-500 rounded-full"></span>
              </h2>
              
              {status === 'success' && (
                <div className="mb-8 bg-green-50 text-green-700 p-5 rounded-2xl font-medium border border-green-100 flex items-center gap-3 animate-pulse">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">✓</div>
                  Your message has been sent! We'll reply within 24 hours.
                </div>
              )}
              
              {status === 'error' && (
                <div className="mb-8 bg-red-50 text-red-600 p-5 rounded-2xl font-medium border border-red-100">
                  Oops! Something went wrong. Please try again.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Your Name</label>
                    <input 
                      required 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-gray-400" 
                      placeholder="e.g. John Doe" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                    <input 
                      required 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-gray-400" 
                      placeholder="john@example.com" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Subject</label>
                  <input 
                    required 
                    type="text" 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange} 
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-gray-400" 
                    placeholder="What's this regarding?" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Your Message</label>
                  <textarea 
                    required 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    rows="6" 
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary-500 transition-all resize-none placeholder:text-gray-400" 
                    placeholder="Tell us how we can help..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="group relative w-full overflow-hidden rounded-2xl bg-primary-600 px-8 py-5 text-lg font-bold text-white transition-all hover:bg-primary-700 hover:shadow-lg active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                      Send Message
                    </>
                  )}
                  {/* Subtle shine effect */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ContactUs;
