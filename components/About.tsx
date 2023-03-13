import React from "react";
import { motion } from "framer-motion";
import { SocialIcon } from "react-social-icons";
import Image from "next/image";
import programmer from "../components/programmer.gif";

type Props = {};

export default function About({}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      whileInView={{
        opacity: 1,
      }}
      transition={{
        duration: 1.5,
      }}
      className="flex flex-col relative h-screen text-center md:text-left md:flex-row max-w-7xl px-10 
  justify-evenly mx-auto items-center"
    >
      <h3 className="absolute top-24 uppercase tracking-[20px] text-gray-500 text-2xl">
        About me
      </h3>

      <motion.div
        initial={{
          x: -200,
          opacity: 0,
        }}
        transition={{
          duration: 1.2,
        }}
        whileInView={{
          x: 0,
          opacity: 1,
        }}
      >
        <Image
          className="-mb-20 md:mb-0 flex-shrink-0 w-[200px] h-[200px] rounded-full object-fit md:rounded-full md:w-[900px] md:h-[240px] xl:w-[4000px] xl:h-[600px]"
          src={programmer}
          alt="programmer"
          width={500}
          height={500}
        />
      </motion.div>

      <div className="space-y-10 px-0 md:px-10">
        <h4 className="text-4xl font-semibold">
          Here is some info{" "}
          <span className="underline decoration-[green]/50">about me</span>
        </h4>
        <p className="text-base">
          My name&apos;s Jordi (
          <a className="underline" href="https://github.com/JordiSRodriguez">
            jordi-dev
          </a>{" "}
          on GitHub), a Software Development Student, I really love coding,
          haven&apos;t stopped doing it since I fell in love with it, right now I&apos;m
          looking for a company to do my practicum on it. I love to be
          constantly learning things and improving my skills, while writing this
          I&apos;m learning{" "}
          <span className="font-bold">
            React.js, Next.js, TailwindCSS and Python
          </span>
          . Constantly I upload my new projects on{" "}
          <a className="underline" href="https://github.com/JordiSRodriguez">
            GitHub
          </a>{" "}
          and skills on my{" "}
          <a
            className="underline"
            href="https://www.linkedin.com/in/jordi-sumba/"
          >
            LinkedIn
          </a>
          . I have a lot to learn and that excites me!
        </p>
      </div>
    </motion.div>
  );
}
