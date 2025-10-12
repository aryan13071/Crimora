import React from "react";

const Cards = ({ task, img }) => {
  return (
    <div className="flex flex-col items-center justify-between bg-white rounded-xl shadow-lg p-4 w-full sm:w-64 md:w-72 lg:w-80 xl:w-96 min-h-[300px] transition transform hover:scale-105">
      <img src={img} alt={task} className="w-full h-48 object-cover rounded-lg mb-4" />
      <button className="bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition">
        {task}
      </button>
    </div>
  );
};

export default Cards;
