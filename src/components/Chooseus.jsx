import React from "react";
import { Disclosure } from "@headlessui/react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqData = [
  {
    question: "Respecting Your Time",
    answer:
      "We know your time is valuable, which is why we prioritize fast communication, quick file delivery, and efficient service. Most orders are completed within 24 hours. You get what you need, when you need it, so your production stays on schedule every time.",
  },
  {
    question: "Latest In Technology",
    answer:
      "We use cutting-edge digitizing software and tools to ensure every design is sharp, stitch-ready, and production-friendly. Our digitizing expert keeps up with industry demands, allowing us to handle complex designs with precision, reduce thread breaks, and deliver consistently smooth results across a wide range of embroidery machines.",
  },
  {
    question: "Professional Work",
    answer:
      "With years of experience in embroidery digitizing, we bring a professional touch to every project. Our skilled team understands both the technical and creative sides of digitizing, ensuring clean stitch paths, balanced density, and flawless finishes. Every file we deliver is crafted with care and expert attention to detail.",
  },
  // {
  //   question: "Free Home Delivery",
  //   answer:
  //     "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et tempus erat, et luctus quam. Maecenas cursus porta tortor, vel consectetur ante volutpat...",
  // },
  {
    question: "High Quality",
    answer:
      "We’re all about quality that shows in every stitch. From simple logos to intricate artwork, we maintain crisp lines, accurate detail, and perfect scaling for all fabric types. Our goal is to make your embroidery look as good—or better—than the original design, every single time.",
  },
  {
    question: "Fast and Reliable Edits",
    answer:
      "Need a tweak? No problem. We offer fast and reliable edits with quick turnaround, so small changes don’t slow down your workflow. Whether it’s a size adjustment or a stitch fix, we handle edits with the same care and speed as the original job—because your satisfaction matters.",
  },
];

const Chooseus = () => {
  return (
    <div className="chooseus  relative  mt-12">
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="container mx-auto py-8">
          {/* Section Title */}
          

          <h1 className="text-center text-4xl font-roboto-slab font-medium text-custom-gray mb-12">
            <span className="text-[#93C572]">Why</span>Choose Us
          </h1>

          {/* Accordion */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-2xl">
              {faqData.map((item, index) => (
                <Disclosure key={index}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex justify-between items-center w-full px-6 py-4 text-left text-black bg-[#93C572] rounded-lg mb-2 focus:outline-none focus-visible:ring focus-visible:ring-white focus-visible:ring-opacity-75">
                        <span className="font-roboto-slab font-medium text-lg">
                          {item.question}
                        </span>
                        <span>
                          {open ? <FaChevronUp /> : <FaChevronDown />}
                        </span>
                      </Disclosure.Button>
                      <Disclosure.Panel className="px-6 pt-2 pb-4 text-black bg-[#93C572] rounded-lg mb-2">
                        <p className="font-roboto text-base">
                          {item.answer}
                        </p>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chooseus;
