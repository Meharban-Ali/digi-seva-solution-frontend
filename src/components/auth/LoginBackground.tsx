import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, Hexagon, Lock } from "lucide-react";

export function LoginBackground() {
  const shouldReduceMotion = useReducedMotion();

  // Floating particle nodes config (15-20 small dots)
  const particles = [
    { id: 1, size: 3, x: "12%", y: "15%", duration: 18, delay: 0 },
    { id: 2, size: 2, x: "82%", y: "12%", duration: 22, delay: 2 },
    { id: 3, size: 3, x: "72%", y: "78%", duration: 16, delay: 1 },
    { id: 4, size: 2, x: "22%", y: "82%", duration: 20, delay: 3 },
    { id: 5, size: 3, x: "88%", y: "42%", duration: 24, delay: 0.5 },
    { id: 6, size: 2, x: "14%", y: "58%", duration: 19, delay: 4 },
    { id: 7, size: 3, x: "45%", y: "10%", duration: 21, delay: 1.5 },
    { id: 8, size: 2, x: "60%", y: "90%", duration: 17, delay: 2.5 },
    { id: 9, size: 3, x: "32%", y: "30%", duration: 23, delay: 3.5 },
    { id: 10, size: 2, x: "92%", y: "25%", duration: 19, delay: 0.8 },
    { id: 11, size: 3, x: "08%", y: "85%", duration: 25, delay: 1.2 },
    { id: 12, size: 2, x: "52%", y: "85%", duration: 18, delay: 4.2 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* 1. Deep Royal Navy & Slate Breathing Radial Base (#0B2046 to #0f172a) */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_85%_85%_at_50%_-10%,rgba(11,32,70,0.85),rgba(15,23,42,1))]"
        animate={
          shouldReduceMotion
            ? {}
            : {
                opacity: [0.9, 1, 0.9],
              }
        }
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        aria-hidden="true"
      />

      {/* 2. Static Corner Accent Glows (Navy to Transparent) */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 bg-slate-800/20 rounded-full blur-3xl"
        aria-hidden="true"
      />

      {/* 3. Security Grid Pattern */}
      <div
        className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:28px_28px]"
        aria-hidden="true"
      />

      {/* 4. Slow Breathing Center Glow behind Card */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] sm:w-[580px] h-[420px] sm:h-[580px] bg-amber-500/08 rounded-full blur-3xl"
        animate={
          shouldReduceMotion
            ? {}
            : {
                scale: [1, 1.06, 1],
                opacity: [0.06, 0.12, 0.06],
              }
        }
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        aria-hidden="true"
      />

      {/* 5. Static Large Security Shield Watermark on Right Side (Hardcoded 2% opacity) */}
      <div
        className="absolute -right-20 -bottom-20 text-white hidden lg:block pointer-events-none select-none"
        style={{ opacity: 0.02 }}
        aria-hidden="true"
      >
        <ShieldCheck className="w-[580px] h-[580px]" />
      </div>

      {/* 6. Floating Shield Outlines & Particles (Respects prefers-reduced-motion) */}
      {!shouldReduceMotion && (
        <>
          {/* Floating Shield motif - Top Left (Hardcoded 3% opacity) */}
          <motion.div
            className="absolute top-[14%] left-[8%] text-[#0B2046]"
            style={{ opacity: 0.03 }}
            animate={{
              y: [0, -14, 0],
              x: [0, 6, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ShieldCheck className="w-16 h-16 stroke-1 text-white" />
          </motion.div>

          {/* Floating Hexagon motif - Top Right (Hardcoded 3% opacity, no animated opacity) */}
          <motion.div
            className="absolute top-[20%] right-[10%] text-amber-500"
            style={{ opacity: 0.03 }}
            animate={{
              y: [0, 16, 0],
              x: [0, -8, 0],
            }}
            transition={{
              duration: 17,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <Hexagon className="w-14 h-14 stroke-1" />
          </motion.div>

          {/* Floating Lock motif - Bottom Left (Hardcoded 3% opacity) */}
          <motion.div
            className="absolute bottom-[20%] left-[10%] text-blue-400"
            style={{ opacity: 0.03 }}
            animate={{
              y: [0, -16, 0],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          >
            <Lock className="w-12 h-12 stroke-1" />
          </motion.div>

          {/* Particle dots slowly drifting upward (Subtle low-opacity pulse) */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-amber-400/20"
              style={{
                width: p.size,
                height: p.size,
                left: p.x,
                top: p.y,
                willChange: "transform",
              }}
              animate={{
                y: [0, -28, 0],
                opacity: [0.04, 0.12, 0.04],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: p.delay,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}

export default LoginBackground;
