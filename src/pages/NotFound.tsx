import { motion } from "framer-motion";

const NotFound = () => {
  // Animation variants for stars
  const starVariants = {
    twinkle: (i: number) => ({
      opacity: [0.3, 1, 0.3],
      transition: {
        duration: 2 + Math.random() * 3,
        repeat: Infinity,
        delay: i * 0.2,
      },
    }),
  };

  // Animation for the spaceship
  const spaceshipVariants = {
    float: {
      y: [0, -15, 0],
      x: [0, 10, 0],
      rotate: [0, 3, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    enginePulse: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Animation for the main content
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Generate random stars
  const stars = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: i * 0.2,
  }));

  return (
    <div
      className="relative min-h-screen w-full bg-slate-900 bg-cover bg-center bg-no-repeat px-4 py-16 text-white flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/da3j9iqkp/image/upload/v1730989736/iqgxciixwtfburooeffb.svg')",
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-slate-900/80"></div>

      <motion.div
        className="relative z-10 text-center max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Animated 404 text */}
        <motion.div className="mb-8" variants={itemVariants}>
          <motion.h1
            className="text-9xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 sm:text-[12rem]"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          >
            404
          </motion.h1>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-4"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          ></motion.div>
        </motion.div>

        {/* Message */}
        <motion.h2
          className="text-2xl font-semibold mb-6 sm:text-3xl md:text-4xl"
          variants={itemVariants}
        >
          Ship Lost in Space?
        </motion.h2>

        <motion.p
          className="text-lg text-slate-300 mb-10 max-w-md mx-auto"
          variants={itemVariants}
        >
          The ShareFilez vessel you're looking for seems to have drifted off
          course. Don't worry, we'll help you navigate back to familiar space.
        </motion.p>

        {/* Animated spaceship illustration */}
        <motion.div
          className="relative mb-12 mx-auto w-64 h-64"
          variants={itemVariants}
        >
          {/* Background nebula */}
          <motion.svg
            className="w-full h-full absolute"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          >
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
            <path
              fill="url(#gradient)"
              d="M40,-74.3C52.1,-65.8,62.2,-55.2,72.1,-43.1C82,-31,91.8,-17.5,92.8,-0.9C93.8,15.7,86,31.4,75.1,44.3C64.2,57.2,50.2,67.3,35.2,73.6C20.2,79.9,4.2,82.4,-9.8,79.3C-23.8,76.2,-35.8,67.5,-47.1,57.1C-58.4,46.7,-68.9,34.6,-74.8,20.4C-80.7,6.2,-82,-10.1,-78.1,-25.1C-74.2,-40.1,-65.1,-53.8,-53.6,-62.6C-42.1,-71.3,-28.2,-75.1,-13.8,-79.2C0.6,-83.3,15.3,-87.6,27.9,-82.8"
              transform="translate(100 100)"
            />
          </motion.svg>

          {/* Floating stars */}
          {stars.map((star) => (
            <motion.div
              key={star.id}
              className="absolute rounded-full bg-white"
              style={{
                width: `${star.size}px`,
                height: `${star.size}px`,
                top: `${star.y}%`,
                left: `${star.x}%`,
              }}
              variants={starVariants}
              custom={star.delay}
              animate="twinkle"
            />
          ))}

          {/* Spaceship */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            variants={spaceshipVariants}
            animate="float"
          >
            <svg
              className="w-32 h-32"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Main ship body */}
              <path d="M50 30L30 60H70L50 30Z" fill="#6366F1" />
              <rect x="35" y="60" width="30" height="15" fill="#4F46E5" />

              {/* Ship details */}
              <circle cx="50" cy="45" r="5" fill="#E5E7EB" />
              <rect x="40" y="50" width="20" height="5" fill="#818CF8" />

              {/* Engine glow */}
              <motion.g variants={spaceshipVariants} animate="enginePulse">
                <path d="M40 75L35 85H45L40 75Z" fill="#60A5FA" />
                <path d="M60 75L55 85H65L60 75Z" fill="#60A5FA" />
              </motion.g>
            </svg>
          </motion.div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={itemVariants}
        >
          <motion.a
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-full flex items-center justify-center"
            whileHover={{
              scale: 1.05,
              background: "linear-gradient(to right, #2563eb, #7c3aed)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Return to Home Base
          </motion.a>

          <motion.a
            href="/contact"
            className="px-6 py-3 bg-slate-800/50 text-white font-medium rounded-full backdrop-blur-sm border border-slate-700 flex items-center justify-center"
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(30, 41, 59, 0.7)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Request Rescue
          </motion.a>
        </motion.div>

        {/* Quick links */}
        <motion.div className="mt-12" variants={itemVariants}>
          <p className="text-slate-400 mb-4">Navigate to these destinations:</p>
          <div className="flex flex-wrap justify-center gap-4">
            {["About", "Privacy", "Contact"].map((page, index) => (
              <motion.a
                key={index}
                href={`/${page.toLowerCase()}`}
                className="text-blue-300 hover:text-blue-200 transition-colors duration-300 text-sm"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {page}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
