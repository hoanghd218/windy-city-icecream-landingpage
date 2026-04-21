"use client";

import Image from "next/image";

/**
 * IceCream360 – CSS 3D rotating cube showcasing ice cream & toppings.
 * size: cube edge length in px (default 160)
 * speed: rotation duration in seconds (default 8)
 */
export default function IceCream360({ size = 160, speed = 8 }) {
  const half = size / 2;

  // 6 faces: front / back / left / right / top / bottom
  const faces = [
    { label: "front",  img: "/ices/kem1.png",   transform: `translateZ(${half}px)` },
    { label: "back",   img: "/ices/kem2.jpg",   transform: `rotateY(180deg) translateZ(${half}px)` },
    { label: "left",   img: "/ices/kem3.webp",  transform: `rotateY(-90deg) translateZ(${half}px)` },
    { label: "right",  img: "/ices/kem5.avif",  transform: `rotateY(90deg)  translateZ(${half}px)` },
    { label: "top",    img: "/ices/kem6.webp",  transform: `rotateX(90deg)  translateZ(${half}px)` },
    { label: "bottom", img: "/ices/kem7.webp",  transform: `rotateX(-90deg) translateZ(${half}px)` },
  ];

  return (
    <>
      <style>{`
        @keyframes spin360 {
          from { transform: rotateY(0deg)   rotateX(-8deg); }
          to   { transform: rotateY(360deg) rotateX(-8deg); }
        }
        .cube-scene {
          width: ${size}px;
          height: ${size}px;
          perspective: ${size * 4}px;
          cursor: grab;
        }
        .cube {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          animation: spin360 ${speed}s linear infinite;
          transition: animation-play-state 0.3s;
        }
        .cube:hover { animation-play-state: paused; }
        .cube-face {
          position: absolute;
          inset: 0;
          width: ${size}px;
          height: ${size}px;
          border-radius: 16px;
          overflow: hidden;
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(4px);
          border: 2px solid rgba(255,255,255,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 0 20px rgba(255,255,255,0.15);
        }
      `}</style>

      <div className="cube-scene">
        <div className="cube">
          {faces.map(({ label, img, transform }) => (
            <div
              key={label}
              className="cube-face"
              style={{ transform }}
            >
              <Image
                src={img}
                alt={label}
                width={size}
                height={size}
                className="object-contain w-full h-full p-4"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
