import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Playtipus from "./Pics/Playtipus.png"

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
              <Image className="h-[900px] w-[500px]" src={Playtipus} alt="Playtipus" />
            </motion.div>

            <div className="space-y-10 px-0 md:px-10 max-w-6xl">
                <a href="https://github.com/JordiSRodriguez/Playtipus">
              <h4 className="text-5xl font-semibold text-center underline decoration-[green]/50">
                  Project 5: Playtipus
              </h4>
              </a>

              <p className="text-2xl text-center">This is a mobile app which is intended to be a marketplace of toys, like Amazon but just for toys, it was made on <span className="underline decoration-[green]/50">Kotlin and Jetpack Compose</span> [Still W-I-P]</p>
            </div>
          </div>
  )
}

export default Project