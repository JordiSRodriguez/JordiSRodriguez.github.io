import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import bash from "./logos/bash-original.svg"

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
        className="rounded-full  object-cover w-24 h-24 md:w-28 md:h-28 xl:w-32 xl:h-32 filter group-hover:grayscale transition duration-300 ease-in-out"
      >
        <Image src={bash} alt="Bash" />
      </motion.div>
      <div className="absolute opacity-0 group-hover:opacity-80 transition duration-300 ease-in-out group-hover:bg-white h-24 w-24 md:w-28 md:h-28 xl:w-32 xl:h-32 rounded-full z-0">
        <div className="flex items-center justify-center h-full">
            <p className="text-3xl font-bold text-black opacity-100 text-center">Bash Scripting</p>
        </div>
      </div>
    </div>
  );
}

export default Skill;
