import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600">Have a question? We'd love to hear from you.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="bg-primary-900 rounded-2xl p-10 text-white shadow-xl">
          <h2 className="text-2xl font-bold mb-8">Get in Touch</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="text-primary-300 mt-1" size={24} />
              <div>
                <h3 className="font-semibold text-lg mb-1">Our Location</h3>
                <p className="text-primary-100">123 Literature Avenue<br/>Sector 4, Gandhinagar<br/>Gujarat, India 382004</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Phone className="text-primary-300 mt-1" size={24} />
              <div>
                <h3 className="font-semibold text-lg mb-1">Phone Number</h3>
                <p className="text-primary-100">+91 9510108864</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="text-primary-300 mt-1" size={24} />
              <div>
                <h3 className="font-semibold text-lg mb-1">Email Address</h3>
                <p className="text-primary-100">support@bookhaven.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl p-10 shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Send a Message</h2>
          
          {status === 'success' && (
            <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-lg font-medium border border-green-200">
              Thank you! Your message has been sent successfully. We will get back to you soon.
            </div>
          )}
          
          {status === 'error' && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg font-medium border border-red-200">
              Failed to send message. Please try again later.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" placeholder="john@example.com" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input required type="text" name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" placeholder="How can we help you?" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea required name="message" value={formData.message} onChange={handleChange} rows="5" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none" placeholder="Write your message here..."></textarea>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? 'Sending...' : <><Send size={20} /> Send Message</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
