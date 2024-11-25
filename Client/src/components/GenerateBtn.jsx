import React from 'react';
import { assets } from '../assets/assets';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const GenerateBtn = () => {
  const { user, setShowLogin } = useContext(AppContext);
  const navigate = useNavigate();

  const onClickHandler = () => {
    if (user) {
      // Scroll to top and navigate
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate('/result');
    } else {
      setShowLogin(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="pb-16 text-center"
    >
      <h1 className="text-2xl md:text-3xl lg:text-4xl mt-4 text-neutral-800 py-6 md:py-16 font-semibold">
        See the magic. Try now
      </h1>
      <button
        onClick={onClickHandler}
        className="inline-flex items-center gap-2 bg-black text-white px-12 py-3 m-auto rounded-full hover:scale-105 transition-all duration-500"
      >
        Generate Images
        <img src={assets.star_group} alt="" className="h-6" />
      </button>
    </motion.div>
  );
};

export default GenerateBtn;
