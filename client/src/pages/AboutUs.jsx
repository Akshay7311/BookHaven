import { BookOpen, Users, Trophy, Truck } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">About BookHaven</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We are dedicated to bringing the greatest collection of literature, web novels, and manga to readers across India and beyond.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <img 
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
            alt="Library" 
            className="rounded-2xl shadow-xl w-full object-cover h-96"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <p className="text-gray-600 mb-4 whitespace-pre-line leading-relaxed">
            Founded with a passion for storytelling, BookHaven started as a small digital archive and has grown into a premier destination for book lovers. 
            
            We specialize in curating high-quality physical prints of the most highly acclaimed digital web novels, epic fantasies, and rare manga collections that are often difficult to find anywhere else.
            
            Our mission is simple: To provide an unparalleled reading experience with seamless delivery, robust packaging, and a community-driven focus.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { icon: BookOpen, title: "Curated Selection", desc: "Handpicked novels and series" },
          { icon: Truck, title: "Fast Delivery", desc: "Nationwide secure shipping" },
          { icon: Users, title: "Community First", desc: "Built for true literary fans" },
          { icon: Trophy, title: "Premium Quality", desc: "Top-tier binding and prints" }
        ].map((feat, i) => (
          <div key={i} className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 mb-4">
              <feat.icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{feat.title}</h3>
            <p className="text-gray-600 text-sm">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
