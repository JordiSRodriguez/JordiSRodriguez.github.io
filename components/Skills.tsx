import React from "react";
import { motion } from "framer-motion";
import Java from "./Skills/Java";
import JavaScript from "./Skills/JavaScript";
import Reactjs from "./Skills/Reactjs";
import Discordjs from "./Skills/Discordjs";
import Kotlin from "./Skills/Kotlin";
import Android from "./Skills/Android";
import Compose from "./Skills/Compose";
import HTML from "./Skills/HTML";
import CSS from "./Skills/CSS";
import TailwindCSS from "./Skills/TailwindCSS";
import Bootstrap from "./Skills/Bootstrap";
import Python from "./Skills/Python";
import MySQL from "./Skills/MySQL";
import MongoDB from "./Skills/MongoDB";
import Firebase from "./Skills/Firebase";
import Linux from "./Skills/Linux";
import Bash from "./Skills/Bash";
import C from "./Skills/C";
import Git from "./Skills/Git";
import Jetbrains from "./Skills/Jetbrains";
import VSCode from "./Skills/VSCode";
import Figma from "./Skills/Figma";

type Props = {};

function Skills({}: Props) {
  return <motion.div className=" flex relative flex-col text-center md:text-left xl:flex-row max-w-[2000px] xl:px-10 min-h-screen justify-center xl:space-y-0 mx-auto items-center">
    <h3 className="absolute top-24 uppercase tracking-[20px] text-gray-500 text-2xl">Skills
    </h3>

    <h3 className="absolute top-36 uppercase tracking-[2px] text-gray-500">These are the technologies I know when you&apos;re watching this</h3>

    <div className="grid grid-cols-4 gap-5 md:grid-cols-5">
        <Java />
        <JavaScript />
        <Reactjs />
        <Discordjs />
        <Kotlin />
        <Android />
        <Compose />
        <HTML />
        <CSS />
        <TailwindCSS />
        <Bootstrap />
        <Python />
        <MySQL />
        <MongoDB />
        <Firebase />
        <Linux />
        <Bash />
        <C />
        <Git />
        <Jetbrains />
        <VSCode />
        <Figma />
    </div>
  </motion.div>;
}

export default Skills;
