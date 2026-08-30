import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, Hexagon, Lock } from "lucide-react";

export function LoginBackground() {
  const shouldReduceMotion = useReducedMotion();

  // Floating particle nodes config
  const particles = [
    { id: 1, size: 6, x: "15%", y: "20%", duration: 18, delay: 0 },
    { id: 2, size: 8, x: "80%", y: "15%", duration: 22, delay: 2 },
    { id: 3, size: 4, x: "70%", y: "75%", duration: 16, delay: 1 },
    { id: 4, size: 5, x: "25%", y: "80%", duration: 20, delay: 3 },
    { id: 5, size: 7, x: "85%", y: "45%", duration: 24, delay: 0.5 },
    { id: 6, size: 4, x: "10%", y: "55%", duration: 19, delay: 4 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* 1. Deep Royal Navy & Slate Radial Gradient Base */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_85%_85%_at_50%_-10%,rgba(11,32,70,0.8),rgba(15,23,42,1))]"
        aria-hidden="true"
      />

      {/* 2. Subtle Security Grid Pattern */}
      <div
        className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px]"
        aria-hidden="true"
      />

      {/* 3. Slow Breathing Radial Glow behind Login Card */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] sm:w-[580px] h-[420px] sm:h-[580px] bg-amber-500/10 rounded-full blur-3xl"
        animate={
          shouldReduceMotion
            ? {}
            : {
                scale: [1, 1.08, 1],
                opacity: [0.08, 0.14, 0.08],
              }
        }
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        aria-hidden="true"
      />

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[440px] h-[300px] sm:h-[440px] bg-blue-600/15 rounded-full blur-2xl"
        animate={
          shouldReduceMotion
            ? {}
            : {
                scale: [1.05, 0.95, 1.05],
                opacity: [0.12, 0.2, 0.12],
              }
        }
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        aria-hidden="true"
      />

      {/* 4. Off-Center Security Watermark Shield */}
      <div
        className="absolute -right-16 -bottom-16 opacity-[0.03] text-white hidden lg:block"
        aria-hidden="true"
      >
        <ShieldCheck className="w-[580px] h-[580px]" />
      </div>

      {/* 5. Slow Floating Shield & Hexagon Geometric Motifs */}
      {!shouldReduceMotion && (
        <>
          {/* Floating Shield motif - Top Left */}
          <motion.div
            className="absolute top-[12%] left-[8%] text-[#0B2046] opacity-[0.25]"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ShieldCheck className="w-20 h-20 text-blue-300/10 stroke-1" />
          </motion.div>

          {/* Floating Hexagon motif - Top Right */}
          <motion.div
            className="absolute top-[18%] right-[10%] text-amber-500/10 opacity-[0.2]"
            animate={{
              y: [0, 20, 0],
              rotate: [0, -8, 0],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <Hexagon className="w-16 h-16 stroke-1" />
          </motion.div>

          {/* Floating Lock motif - Bottom Left */}
          <motion.div
            className="absolute bottom-[18%] left-[12%] text-blue-400/10 opacity-[0.15]"
            animate={{
              y: [0, -18, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          >
            <Lock className="w-14 h-14 stroke-1" />
          </motion.div>

          {/* 6. Subtle Floating Particle Nodes */}
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
                y: [0, -30, 0],
                opacity: [0.15, 0.4, 0.15],
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
