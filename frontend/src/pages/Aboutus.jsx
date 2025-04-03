import { Users,Award, Star, Store, TrendingUp } from 'lucide-react';
import About from '../components/About/about';
// import trimzImg from '../assets/images/trimz.png';
import trimzImg from '../assets/images/about1.jpg';

const Aboutus = () => {
  return (
    <section className="min-h-screen bg-white">
        <div>
            <About/>
        </div>
      {/* Hero Section */}
      <div className="bg-yellow-50 mb-[-90px] ">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Connecting Clients with Top Barbers & Stylists
            </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The leading marketplace for beauty and wellness services
          </p>
        </div>
      </div>      

      {/* Mission Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                To revolutionize how people book and manage their beauty and wellness appointments, while helping professionals grow their business.
              </p>
              <div className="space-y-4">
                {[
                  "Empower beauty professionals with modern tools",
                  "Connect clients with trusted service providers",
                  "Simplify the booking experience",
                  "Drive business growth through technology"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img 
                src={trimzImg} 
                alt="Platform showcase" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Store className="w-8 h-8" />,
              title: "For Business",
              features: ["Client management", "Online scheduling", "Marketing tools", "Payment processing"]
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: "For Clients",
              features: ["24/7 online booking", "Verified reviews", "Instant confirmations", "Mobile app access"]
            },
            {
              icon: <TrendingUp className="w-8 h-8" />,
              title: "Platform Benefits",
              features: ["Smart marketing", "Business insights", "Secure payments", "Customer support"]
            }
          ].map((benefit, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-sm border">
              <div className="text-irisBlueColor mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
              <ul className="space-y-2">
                {benefit.features.map((feature, idx) => (
                  <li key={idx} className="text-gray-600">{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {/* ==== Award ===== */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Awards & Recognition</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                year: "2023",
                award: "Best Beauty Tech Platform",
                org: "Beauty Innovation Awards",
                icon: <Star className="w-6 h-6" />
              },
              {
                year: "2022",
                award: "Excellence in Customer Service",
                org: "Digital Service Awards",
                icon: <Award className="w-6 h-6" />
              },
              {
                year: "2022",
                award: "Top Booking Platform",
                org: "Beauty Business Review",
                icon: <Star className="w-6 h-6" />
              },
              {
                year: "2021",
                award: "Innovation in Beauty Tech",
                org: "Tech Excellence Awards",
                icon: <Award className="w-6 h-6" />
              }
            ].map((award, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border text-center">
                <div className="text-irisBlueColor mb-4 flex justify-center">
                  {award.icon}
                </div>
                <div className="text-sm text-irisBlueColor font-semibold mb-2">{award.year}</div>
                <h3 className="font-semibold mb-2">{award.award}</h3>
                <p className="text-sm text-gray-600">{award.org}</p>
              </div>
            ))}
          </div>
          
        </div>
      </div>
        
    </section>
    
  );
};

export default Aboutus;