import { FileSignature, Scale } from 'lucide-react';

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 prose prose-lg prose-primary">
      <div className="text-center mb-12">
        <FileSignature className="mx-auto h-16 w-16 text-primary-600 mb-4" />
        <h1 className="text-4xl font-extrabold text-gray-900">Terms and Conditions</h1>
        <p className="text-gray-500 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
        <section>
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-4"><Scale size={24} className="text-primary-500"/> Agreement to Terms</h2>
          <p className="text-gray-600">
            By accessing or using the BookHaven website and services, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Purchases</h2>
          <p className="text-gray-600">
            If you wish to purchase any product made available through the Service ("Purchase"), you may be asked to supply certain information relevant to your Purchase including, without limitation, your credit card number, the expiration date of your credit card, your billing address, and your shipping information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Accounts</h2>
          <p className="text-gray-600">
            When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
