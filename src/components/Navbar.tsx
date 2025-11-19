import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { HandBurger } from "./HandBurger";
import { HomeIcon } from "lucide-react";
type Position = {
  left: number;
  width: number;
  opacity: number;
};

export const Nav = () => {
  const [isHidden, setIsHidden] = useState(false);
  const { scrollY } = useScroll();
  const lastYRef = useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    const difference = y - lastYRef.current;
    if (Math.abs(difference) > 50) {
      setIsHidden(difference > 0);
      lastYRef.current = y;
    }
  });

  return (
    <motion.div
      animate={isHidden ? "hidden" : "visible"}
      whileHover="visible"
      onFocusCapture={() => setIsHidden(false)}
      variants={{
        hidden: {
          y: "-90%",
        },
        visible: {
          y: "0%",
        },
      }}
      transition={{ duration: 0.2 }}
      className="fixed top-0 z-50 box-border flex w-full justify-center items-center px-10 "
    >
      <div>
        <Link to={"/"} className="absolute left-8 top-5 flex gap-4">
          <div className="hidden md:hidden xl:flex text-2xl font-bold text-white ">
            ShipFilez
          </div>
        </Link>
      </div>

      <SlideTabs />
      <Link to={"/"} className="hidden md:flex lg:hidden">
        <HomeIcon size={40} className="text-yellow-400 text" />
      </Link>
      <HandBurger />
    </motion.div>
  );
};

const SlideTabs = () => {
  const [position, setPosition] = useState<Position>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <ul
      onMouseLeave={() => {
        setPosition((pv) => ({
          ...pv,
          opacity: 0,
        }));
      }}
      className="relative mx-auto hidden w-fit rounded-full border-2 border-[#ffffff] bg-[#003366] p-1 font-bold md:flex md:px-0 lg:px-6"
    >
      <Tab setPosition={setPosition} link="/about">
        <Link to="/about">ABOUT</Link>
      </Tab>
      <Tab setPosition={setPosition} link="/contact">
        <Link to="/contact">CONTACT</Link>
      </Tab>
      <Tab setPosition={setPosition} link="/privacy">
        <Link to="/privacy">privacy</Link>
      </Tab>
      <Tab setPosition={setPosition} link="/blog">
        <Link to="/blog">Blogs</Link>
      </Tab>
      <Tab setPosition={setPosition} link="/nearby">
        <Link to="/nearby">NEARBY SHARE</Link>
      </Tab>
      <Cursor position={position} />
    </ul>
  );
};

const Tab = ({
  children,
  setPosition,
  link,
}: {
  children: any;
  link: string;
  setPosition: any;
}) => {
  const ref = useRef<null | HTMLLIElement>(null);
  const router = useNavigate();
  return (
    <li
      onClick={() => router(link)}
      ref={ref}
      onMouseEnter={() => {
        if (!ref?.current) return;

        const { width } = ref.current.getBoundingClientRect();

        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      className="relative z-10 block cursor-pointer text-xs uppercase text-white hover:text-black md:px-5 md:py-3 md:text-base"
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }: { position: Position }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      className="absolute z-0 h-7 rounded-full bg-yellow-400 md:h-12"
    />
  );
};

export default Nav;
