import { ShieldCheck, Lock, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 prose prose-lg prose-primary">
      <div className="text-center mb-12">
        <ShieldCheck className="mx-auto h-16 w-16 text-primary-600 mb-4" />
        <h1 className="text-4xl font-extrabold text-gray-900">Privacy Policy</h1>
        <p className="text-gray-500 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
        <section>
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-4"><Lock size={24} className="text-primary-500"/> Information We Collect</h2>
          <p className="text-gray-600">
            We collect information you provide directly to us when you create an account, make a purchase, or contact our support team. This physical information includes your Name, Email Address, Phone Number, and Shipping Address necessary to fulfill your orders.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-4"><FileText size={24} className="text-primary-500"/> How We Use Information</h2>
          <p className="text-gray-600 mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Process transactions and fulfill your book orders.</li>
            <li>Send you technical notices, updates, security alerts, and support messages.</li>
            <li>Respond to your comments, questions, and customer service requests.</li>
            <li>Communicate with you about products, services, offers, and events offered by BookHaven.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Data Security</h2>
          <p className="text-gray-600">
            We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. Your passwords are cryptographically hashed using industry-standard BCRYPT algorithms, and authentication is securely isolated via JSON Web Tokens.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
