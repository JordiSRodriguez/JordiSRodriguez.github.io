import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import TerminalFicheros from "./Pics/TerminalFicheros.png"

type Props = {}

function Project({}: Props) {
  return (
    <div className="w-screen flex-shrink-0 snap-center flex flex-col space-y-5 items-center justify-center p-20 md:p-44 h-screen">
            <motion.div
              initial={{
                y: -300,
                opacity: 0,
              }}
              transition={{ duration: 1.2 }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
            >
              <Image src={TerminalFicheros} alt="TerminalFicheros" />
            </motion.div>

            <div className="space-y-10 px-0 md:px-10 max-w-6xl">
                <a href="https://github.com/JordiSRodriguez/TerminalFicheros">
              <h4 className="text-5xl font-semibold text-center underline decoration-[green]/50">
                  Project 2: Terminal de Ficheros
              </h4>
              </a>

              <p className="text-2xl text-center">This is a clone of the Windows Terminal but implementing new commands, it was purely made on <span className="underline decoration-[green]/50">Java</span></p>
            </div>
          </div>
  )
}

export default Project