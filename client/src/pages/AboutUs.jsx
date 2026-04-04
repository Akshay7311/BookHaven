import { BookOpen, Users, Trophy, Truck } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-24 space-y-6">
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight">
            Our <span className="text-primary-600">Story</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed border-l-4 border-primary-500 pl-6 text-left">
            We are dedicated to bringing the greatest collection of literature, web novels, and manga to readers across India and beyond.
            Founded with a passion for storytelling, BookHaven started as a small digital archive and has grown into a premier destination for book lovers. 
          </p>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary-500 to-primary-700 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <img 
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
              alt="Library" 
              className="relative rounded-2xl shadow-2xl w-full object-cover h-[500px]"
            />
          </div>
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-gray-900 leading-tight">
              Curating Stories That <br/>
              <span className="text-primary-600 underline decoration-primary-200 underline-offset-8">Matter to You</span>
            </h2>
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
              <p>
                We specialize in curating high-quality physical prints of the most highly acclaimed digital web novels, epic fantasies, and rare manga collections that are often difficult to find anywhere else.
              </p>
              <p>
                Our mission is simple: To provide an unparalleled reading experience with seamless delivery, robust packaging, and a community-driven focus.
              </p>
            </div>
            <div className="pt-4">
                <button className="bg-primary-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-800 transition-all shadow-lg active:scale-95">
                    Explore Our Collection
                </button>
            </div>
          </div>
        </div>

        {/* Stats/Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: BookOpen, title: "Curated Selection", desc: "Handpicked novels and series from global authors." },
            { icon: Truck, title: "Fast Delivery", desc: "Nationwide secure shipping with premium packaging." },
            { icon: Users, title: "Community First", desc: "Built for true literary fans and collectors." },
            { icon: Trophy, title: "Premium Quality", desc: "Top-tier binding and high-definition prints." }
          ].map((feat, i) => (
            <div key={i} className="group p-8 bg-gray-50 rounded-3xl border border-transparent hover:border-primary-100 hover:bg-white hover:shadow-xl transition-all duration-300">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white text-primary-600 mb-6 shadow-sm group-hover:bg-primary-600 group-hover:text-white transition-all">
                <feat.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feat.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default AboutUs;
