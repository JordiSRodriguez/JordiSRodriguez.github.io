import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import appurl from "./Pics/Appurl.png"

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
              <Image src={appurl} alt="Aplicacion URL" />
            </motion.div>

            <div className="space-y-10 px-0 md:px-10 max-w-6xl">
                <a href="https://github.com/JordiSRodriguez/AplicacionURL">
              <h4 className="text-5xl font-semibold text-center underline decoration-[green]/50">
                  Project 6: Aplicacion URL
              </h4>
              </a>

              <p className="text-2xl text-center">This is a tool useful to execute network commands such as ping, tracert, curl... it was made on <span className="underline decoration-[green]/50">Java and Java Swing</span></p>
            </div>
          </div>
  )
}

export default Project