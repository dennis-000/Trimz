import { BsCalendar2Check, BsClock, BsScissors } from 'react-icons/bs';

const BottomCTA = () => {
  return (
    <div className="relative bg-white text-gray-800 py-16 mt-16 overflow-hidden shadow-lg">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute transform rotate-12 -right-24 -top-24">
          <BsScissors className="w-48 h-48 text-gray-900" />
        </div>
        <div className="absolute -left-24 -bottom-24">
          <BsScissors className="w-48 h-48 text-gray-800" />
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="text-left space-y-6">
            <h2 className="text-[32px] md:text-[40px] font-bold leading-tight">
              Ready to Transform <br />
              <span className="text-yellow-500">Your Style?</span>
            </h2>

            <div className="space-y-4">
              {[
                {
                  icon: <BsClock className="w-6 h-6" />,
                  title: 'Flexible Hours',
                  description: 'Open Mon-Sat: At your desired Time',
                },
                {
                  icon: <BsCalendar2Check className="w-6 h-6" />,
                  title: 'Easy Booking',
                  description: 'Book online or call us',
                },
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content */}
        <div className="text-center md:text-right space-y-6">
        <p className="text-[18px] leading-7 md:max-w-md ml-auto">
            Discover the art of grooming with our skilled barbers who are dedicated to 
            enhancing your personal style. Experience luxury and comfort with every visit! 
        </p>

        <div className="flex items-center justify-center md:justify-end gap-4 text-sm">
            <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            Now Accepting Appointments
            </span>
            <span className="text-yellow-500">★★★★★ 4.9/5</span>
        </div>
    </div>
</div>

        {/* Trust Indicators */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { number: '5000+', label: 'Happy Clients' },
              { number: '15+', label: 'Expert Barbers' },
              { number: '10+', label: 'Years Experience' },
              { number: '100%', label: 'Satisfaction' },
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-[24px] font-bold">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomCTA;
