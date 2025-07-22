import React from "react";
import Slider from "react-slick";
import { FaFacebook, FaTwitter, FaGooglePlus, FaLinkedin } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";



const testimonialsData = [
  {
    id: 1,
    name: "Amanda",
    position: "MDH",
    description:
      "These guys are fast and spot-on every time. Total lifesavers for my last-minute orders!",
    image: '' ,
    social: {
      facebook: "#",
      twitter: "#",
      googlePlus: "#",
      linkedin: "#",
    },
  },
  {
    id: 2,
    name: "James",
    position: "MDH",
    description:
      "Sent my logo in the evening, had a perfect file the next day. Super impressed!",
        image: '' ,
    social: {
      facebook: "#",
      twitter: "#",
      googlePlus: "#",
      linkedin: "#",
    },
  },
  {
    id: 3,
    name: "Michelle",
    position: "MDH",
    description:
     "Really easy to work with, and the quality is always solid.",
    image: '' ,
    social: {
      facebook: "#",
      twitter: "#",
      googlePlus: "#",
      linkedin: "#",
    },
  },
  {
    id: 4,
    name: "Carlos",
    position: "MDH",
    description: "Quick, friendly, and the stitch files come out clean every time. Love working with them!",
    image: '' ,
    social: {
      facebook: "#",
      twitter: "#",
      googlePlus: "#",
      linkedin: "#",
    },
  },
  {
    id: 5,
    name: "Steve",
    position: "MDH",
    description: "Been using Quick Digitizing for years now—never had an issue they can’t fix. Just solid work.",
    image: '' ,
    social: {
      facebook: "#",
      twitter: "#",
      googlePlus: "#",
      linkedin: "#",
    },
  },
  {
    id: 6,
    name: "Nina",
    position: "MDH",
    description: "They made a complicated design look easy. Stitch quality was amazing!",
    image: '' ,
    social: {
      facebook: "#",
      twitter: "#",
      googlePlus: "#",
      linkedin: "#",
    },
  },
  {
    id: 7,
    name: "Trevor",
    position: "MDH",
    description: "Fast replies, quick edits, no fuss. They make my job way easier.",
    image:''  ,
    social: {
      facebook: "#",
      twitter: "#",
      googlePlus: "#",
      linkedin: "#",
    },
  },
  {
    id: 8,
    name: "Lena",
    position: "MDH",
    description: "Tried a bunch of digitizers before—these folks are the real deal. Super reliable.",
    image:''  ,
    social: {
      facebook: "#",
      twitter: "#",
      googlePlus: "#",
      linkedin: "#",
    },
  },
  {
    id: 9,
    name: "Marcus",
    position: "MDH",
    description: "Always on time, always clean files. They’ve totally earned my trust.",
    image: '' ,
    social: {
      facebook: "#",
      twitter: "#",
      googlePlus: "#",
      linkedin: "#",
    },
  },
];

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={`${className} text-fbae44 hover:text-fbae40`}
      style={{ ...style, display: "block", left: "25px", zIndex: 1 }}
      onClick={onClick}
      aria-label="Previous Slide"
    />
  );
};

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={`${className} text-fbae44 hover:text-fbae40`}
      style={{ ...style, display: "block", right: "25px", zIndex: 1 }}
      onClick={onClick}
      aria-label="Next Slide"
    />
  );
};

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 800,
  slidesToShow: 3,
  slidesToScroll: 3, 
  arrows: false,
  autoplay: true,
  autoplaySpeed: 4000,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};


const Testimonial = () => {
  return (
    <div className="testimonial py-8">
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="container mx-auto my-12">
          

           {/* Title Section */}
           <h1 className="text-center text-4xl font-roboto-slab font-medium text-custom-gray mb-12">
            <span className="text-[#93C572]">Our</span>Happy Customers
          </h1>

          {/* Carousel */}
          <Slider {...sliderSettings} className="z-10 relative">
            {testimonialsData.map((testimonial) => (
              <div key={testimonial.id} className="px-4 ">
                <div className="flex flex-col items-center bg-[#AFE1AF] p-6 rounded-lg shadow-lg" style={{height:"16rem",display:"flex",justifyContent:"space-between"}}>
                  {/* Customer Image */}
                 

                  {/* Customer Name */}
                  <h3 className="text-2xl font-roboto-slab font-medium text-[#10170c] mb-1">
                    {testimonial.name}
                  </h3>

                  {/* Customer Position */}
                  <span className="text-md font-roboto text-[#9FE2BF] mb-4">
                    {testimonial.position}
                  </span>

                  {/* Customer Feedback */}
                  <p className="text-center text-base font-roboto text-black mb-6">
                    {testimonial.description}
                  </p>

                  {/* Social Icons */}
                  <ul className="flex space-x-4 mt-4">
                    {testimonial.social.facebook && (
                      <li>
                        <a
                          href={testimonial.social.facebook}
                          className="text-white hover:text-[#93C572] transition duration-300"
                          aria-label={`${testimonial.name} Facebook`}
                        >
                          <FaFacebook size={24} />
                        </a>
                      </li>
                    )}
                    {testimonial.social.twitter && (
                      <li>
                        <a
                          href={testimonial.social.twitter}
                          className="text-white hover:text-[#93C572] transition duration-300"
                          aria-label={`${testimonial.name} Twitter`}
                        >
                          <FaTwitter size={24} />
                        </a>
                      </li>
                    )}
                    {testimonial.social.googlePlus && (
                      <li>
                        <a
                          href={testimonial.social.googlePlus}
                          className="text-white hover:text-[#93C572] transition duration-300"
                          aria-label={`${testimonial.name} Google Plus`}
                        >
                          <FaGooglePlus size={24} />
                        </a>
                      </li>
                    )}
                    {testimonial.social.linkedin && (
                      <li>
                        <a
                          href={testimonial.social.linkedin}
                          className="text-white hover:text-[#93C572] transition duration-300"
                          aria-label={`${testimonial.name} LinkedIn`}
                        >
                          <FaLinkedin size={24} />
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
