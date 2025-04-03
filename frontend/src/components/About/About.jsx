/* eslint-disable react/no-unknown-property */
import ceoImg from "../../assets/images/ecutz-ceo.png";
import aboutCardimg from "../../assets/images/about-card1.png";
// import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram } from "lucide-react";


// Functional component for the About section
function About() {
  return (
    <section>
      <div className="container">
        <div className="flex justify-between gap-[50px] lg:gap-[130px] xl:gap-0 flex-col lg:flex-row">
          {/* ============= ABOUT IMAGE ========= */}
          <div className="relative w-3/4 lg:w-1/2 xl:w-[400px] z-10 order-1 lg:order-2 perspective-1000">
            <div
              className="group relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-700 
    border-2 border-transparent 
    hover:border-gradient-to-r hover:from-blue-100 hover:via-white hover:to-blue-100
    transform hover:rotate-1 hover:scale-[1.01]"
            >
              <div
                className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-blue-100/30 
        opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out"
              ></div>
              <img
                src={ceoImg}
                alt="About Ecutz Image"
                className="w-full h-[380px] object-cover object-top
            filter grayscale-[30%] brightness-90 contrast-110 
            group-hover:grayscale-0 group-hover:brightness-100 group-hover:contrast-100
            transition-all duration-700 ease-in-out 
            origin-center hover:scale-105"
              />
              {/* Subtle glare effect */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-0 left-0 w-1/2 h-full bg-white/20 skew-x-[35deg] animate-glare"></div>
              </div>
            </div>

            <div
              className="absolute z-30 bottom-0 w-[200px] md:w-[250px] lg:w-[300px] right-[-15%] md:right-[-10%] lg:right-[-20%] xl:right-[-15%] 
    transform -translate-y-1/4 group-hover:translate-y-0 transition-all duration-700 ease-in-out"
            >
              <div className="duration-700 hover:rotate-2 hover:scale-105 hover:shadow-3xl">
                <img
                  src={aboutCardimg}
                  alt="Card Testimonial"
                  className="w-full rounded-xl 
                filter brightness-95 contrast-110 
                group-hover:brightness-100 group-hover:contrast-100
                transition-all duration-700"
                />
              </div>
            </div>

            {/* Animated gradient border on hover */}
            <style jsx>{`
              @keyframes glare {
                0% {
                  transform: skewX(35deg) translateX(-100%);
                }
                100% {
                  transform: skewX(35deg) translateX(300%);
                }
              }
              .animate-glare {
                animation: glare 3s infinite linear;
                @media (prefers-reduced-motion: reduce) {
                  animation: none;
                }
              }
              .hover:border-gradient-to-r {
                border-image: linear-gradient(
                    to right,
                    #bae6fd,
                    #ffffff,
                    #bae6fd
                  )
                  1;
              }
            `}</style>
          </div>

          {/* ==================================================================== */}

          {/* =========== About Content ============ */}
          <div className="w-full lg:w-1/2 xl:w-[670px] order-1 lg:order-2">
            <h2 className="heading">
              Meet the Visionary Behind Trimz
            </h2>
            <p className="text__para">
              Trimz is the brainchild of Saddiq Ahmed, a forward-thinking
              entrepreneur passionate about blending technology with everyday
              convenience. Recognizing the challenges people face in accessing
              quality grooming services, Saddiq Ahmed envisioned Trimz as more
              than just an app it’s a lifestyle solution.
            </p>
            {/* ========= FOR MORE THEN UNCOMMENT =========== */}
            {/* <p className='text__para mt-[30px]'>
                        This is a grooming app designed for students,
                        connecting them with skilled barbers and hair stylists on campus. With features
                        like profile browsing, appointment scheduling, and location finding, students can
                        easily book services and get a fresh cut or style with just a few taps.
                        Trimz makes on-campus grooming quick, convenient, and hassle-free.
                    </p> */}
            {/* <Link to="/about">
              <button className="btn">Learn More</button>
            </Link> */}
           
            <div className="flex space-x-4 mt-[30px]">
                <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer">
                  <Facebook className="w-6 h-6 text-gray-700 hover:text-blue-600 transition" />
                </a>
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
                  <Twitter className="w-6 h-6 text-gray-700 hover:text-blue-400 transition" />
                </a>
                <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-6 h-6 text-gray-700 hover:text-pink-500 transition" />
                </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

//  Will be Exporting the About component for use in other parts of the application
export default About;
