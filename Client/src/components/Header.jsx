import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react"
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";


const Header = () => {

  const {user,setShowLogin} = useContext(AppContext);
  const Navigate = useNavigate();

  const onClickHandler = () => {
    if(user) {
      Navigate("/result")
    } else {
      setShowLogin(true)
    }
  }



  return (
    <motion.div className="flex flex-col justify-center items-center text-center my-20"
    
    initial={{ opacity: 0.2, y: 100 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    viewport={{ once: true }}
    >
      <motion.div className="text-stone-500 inline-flex text-center gap-2 bg-white py-1 px-6 rounded-full border border-neutral-500"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 1 }}>

        <p>Best text to image generator</p>
        <img src={assets.star_icon} alt="" />
      </motion.div>
      <motion.h1 className="text-4xl max-x-[300px] sm:text-7xl sm:max-w-[590px] mx-auto mt-10 text-center">
        Turn text to <span className="text-blue-600"
        initial={{ opacity: 0}}
        animate={{ opacity: 1}}
        transition={{ delay: 0.4, duration: 2 }}
        >image</span>, in seconds
      </motion.h1>

      <motion.p className="text-center max-w-xl mx-auto mt-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1 , y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      >
        Unleash your creativity with AI. Turn your imagination into visual art
        in seconds - just type, and watch the magic happen.
      </motion.p>

      <motion.button onClick={onClickHandler} className="sm:text-lg text-white bg-black w-auto mt-8 px-12 py-2.5 flex items-center gap-2 rounded-full"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0}}
      animate={{ opacity: 1}}
      transition={{ default: { duration: 0.5 } ,opacity : {delay: 0.8, duration: 1 } }}
      >
        Generate Images
        <img className="h-6" src={assets.star_group} alt="" />
      </motion.button>

      <motion.div 
      initial={{ opacity: 0}}
      animate={{ opacity: 1}}
      transition={{ delay: 1, duration: 1 }}
      className="flex items-wrap justify-center gap-3 mt-16">
        {Array(6).fill('').map((item, index) => (
            <motion.img 
            whileHover={{scale: 1.05 , duration: 0.1}}
            className="rounded hover:scale-105 transition-all duration-300 cursor-pointer mx-sm:w-10" src={index % 2 === 0 ? assets.sample_img_2 : assets.sample_img_1} alt="" key={index} width={70}/>
        ))}
      </motion.div>
      <motion.p 
      initial={{ opacity: 0}}
      animate={{ opacity: 1}}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="mt-2 text-neutral-600">Generated images from imagify </motion.p>
    </motion.div>
  );
};

export default Header;
