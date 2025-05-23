import React, { useEffect } from "react";
import {
  Hero,
  ProductElement,
  Stats,
  Testimonial,
  Ourexpert,
  Chooseus,
} from "../components";
import { useLoaderData, useNavigate } from "react-router-dom";
import axios from "axios";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <main className="bg-gray-100 ">
      <Hero />
      <Stats />
      <Ourexpert />
      <Testimonial />
      <Chooseus />

      {/* <div className="selected-products">
        <h2 className="text-4xl text-center my-12 max-md:text-3xl text-accent-content">
            Our New Arrivals
        </h2>
        <div className="selected-products-grid max-w-7xl mx-auto">
          {products.map((product) => (
            <ProductElement
              key={product.id}
              id={product.id}
              title={product.name}
              image={product.imageUrl}
              rating={product.rating}
              price={product.price.current.value}
            />
          ))}
        </div>
      </div> */}
    </main>
  );
};

export default Landing;
