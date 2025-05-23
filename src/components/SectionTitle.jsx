import React from "react";

const SectionTitle = ({ title, path }) => {
  return (
    <div className=" pt-5 pb-5 ">
      <h1 className=" section-title-title text-2xl text-center  font-bold text-green">
        {title}
      </h1>
    </div>
  );
};

export default SectionTitle;

