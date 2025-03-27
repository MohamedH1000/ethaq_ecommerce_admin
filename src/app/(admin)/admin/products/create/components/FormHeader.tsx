// components/FormHeader.jsx
import React from "react";

const FormHeader = ({ title }) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{title}</h1>
      <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
    </div>
  );
};

export default FormHeader;
