
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBanner } from '../components/StatusBanner';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <StatusBanner />
      
      <section className="relative py-20 px-4 overflow-hidden bg-white">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-neutral-900 mb-6 tracking-tight">
            Premium Food for <br />
            <span className="text-primary">Corporate Excellence</span>
          </h1>
          <p className="text-xl text-neutral-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Quick, reliable, and delicious catering delivered right to your office block or department.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/order')}
              className="w-full sm:w-auto px-8 py-4 bg-primary text-black font-bold text-lg rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all"
            >
              Оформить заказ
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-neutral-200 text-neutral-700 font-bold text-lg rounded-xl hover:bg-neutral-50 transition-all">
              Learn More
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"></div>
      </section>

      <section className="py-20 px-4 bg-neutral-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Wide Selection', desc: 'From special sandwiches to custom ingredients.', icon: '🥪' },
            { title: 'Block Delivery', desc: 'We deliver to all wings and departments.', icon: '🏢' },
            { title: 'Fast Service', desc: 'Optimized windows for morning and day shifts.', icon: '⚡' }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">{feature.title}</h3>
              <p className="text-neutral-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
