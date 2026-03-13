import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "Do you ship internationally?",
      a: "Currently, we only ship within India. We are looking to expand our coverage globally in the near future."
    },
    {
      q: "How long will it take to get my order?",
      a: "Standard shipping takes 4-5 business days. We also offer Express Priority shipping which delivers within 1-2 business days."
    },
    {
      q: "Can I return my book if it's damaged?",
      a: "Absolutely. We have a 14-day return policy. Contact our support via the Contact Us page and we will initiate a replacement or full refund immediately."
    },
    {
      q: "Are the manga and web novels authentic?",
      a: "Yes, all our items correspond to official licensed prints sourced directly from publishers or verified distributors."
    },
    {
        q: "How do I track my order?",
        a: "If the Administrator has dispatched your parcel, navigate to 'My Orders' in your Profile. You will find your Tracking Number and Carrier Name updated there."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600">Everything you need to know about the product and billing.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index}
            className="border border-gray-200 rounded-xl bg-white overflow-hidden transition-all duration-200"
          >
            <button
              className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            >
              <span className="font-semibold text-lg text-gray-900">{faq.q}</span>
              {openIndex === index ? (
                <ChevronUp className="text-primary-600 flex-shrink-0" size={20} />
              ) : (
                <ChevronDown className="text-gray-400 flex-shrink-0" size={20} />
              )}
            </button>
            
            <div 
              className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="text-gray-600">{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
