import { motion } from "framer-motion";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export const HandBurger = () => {
  const router = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <motion.div className="md:hidden ">
      {/* Hamburger/Close Icon */}
      <motion.div
        className="absolute right-6 top-4 z-50 cursor-pointer text-4xl text-yellow-400"
        onClick={() => setOpen(!open)}
        initial={{ rotate: 0 }}
        animate={{ rotate: open ? 90 : 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {open ? <AiOutlineClose /> : <GiHamburgerMenu />}
      </motion.div>

      {/* Mobile Menu */}
      <motion.div
        className="absolute right-0 top-0 z-40 flex h-screen w-screen flex-col items-center justify-center gap-8 rounded-l-lg bg-[#062354] opacity-90"
        initial={{ x: "100%" }}
        animate={{ x: open ? "0%" : "100%" }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
        }}
        style={{ pointerEvents: open ? "auto" : "none" }}
      >
        <ul className="space-y-20 text-center text-3xl font-bold text-yellow-400">
          <motion.li
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer"
            onClick={() => {
              router("/");
              setOpen(false);
            }}
          >
            HOME
          </motion.li>
          <motion.li
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer"
            onClick={() => {
              router("/about");
              setOpen(false);
            }}
          >
            ABOUT
          </motion.li>
          <motion.li
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer"
            onClick={() => {
              router("/blog");
              setOpen(false);
            }}
          >
            Blogs
          </motion.li>
          <motion.li
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer"
            onClick={() => {
              router("/contact");
              setOpen(false);
            }}
          >
            CONTACT
          </motion.li>
          <motion.li
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer"
            onClick={() => {
              router("/privacy");
              setOpen(false);
            }}
          >
            PRIVACY
          </motion.li>
          <motion.li
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              router("/nearby");
              setOpen(false);
            }}
            className="cursor-pointer"
          >
            NEARBY SHARE
          </motion.li>
        </ul>
      </motion.div>
    </motion.div>
  );
};
