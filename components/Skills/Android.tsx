import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import android from "./logos/android-original.svg"

type Props = {};

function Skill({}: Props) {
  return (
    <div className="group relative flex cursor-pointer">
      <motion.div
      initial={{
            opacity: 0,
            scale: 0.4,
      }}
      transition={{
            duration: 1.5,
      }}
      whileInView={{
            opacity: 1,
            scale: 1,
        }}
        className="rounded-full  object-cover w-20 h-20 md:w-22 md:h-22 xl:w-32 xl:h-32 filter group-hover:grayscale transition duration-300 ease-in-out"
      >
        <Image src={android} alt="Android Development" />
      </motion.div>
      <div className="absolute opacity-0 group-hover:opacity-80 transition duration-300 ease-in-out group-hover:bg-white h-20 w-20 md:w-22 md:h-22 xl:w-32 xl:h-32 rounded-full z-0">
        <div className="flex items-center justify-center h-full">
            <p className="text-3xl font-bold text-black opacity-100 text-center">Android Development</p>
        </div>
      </div>
    </div>
  );
}

export default Skill;
