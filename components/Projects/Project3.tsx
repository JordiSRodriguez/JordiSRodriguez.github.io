import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import GestorNotas from "./Pics/GestorNotas.png"

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
              <Image src={GestorNotas} alt="Gestor de Notas" />
            </motion.div>

            <div className="space-y-10 px-0 md:px-10 max-w-6xl">
                <a href="https://github.com/JordiSRodriguez/GestorNotas_Front-end">
              <h4 className="text-5xl font-semibold text-center underline decoration-[green]/50">
                  Project 3: Gestor de Notas
              </h4>
              </a>

              <p className="text-2xl text-center">This program allows you to execute another .jar and write, read, modify and delete grades with a student id, it was purely made on <span className="underline decoration-[green]/50">Java</span></p>
            </div>
          </div>
  )
}

export default Project