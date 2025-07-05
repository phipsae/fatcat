"use client";

import Image from "next/image";

type FatCatProps = {
  weight?: number;
};

export const FatCat: React.FC<FatCatProps> = ({ weight = 1 }) => {
  const clampedWeight = Math.min(Math.max(weight, 1), 10);
  const bellyScale = 1 + clampedWeight * 0.03; // tweak the `20` to your liking

  // Base belly size (before scaling)
  const bellyWidth = 146;
  const bellyHeight = 138;

  // Scaled dimensions
  const tailOffset = bellyWidth - 10 + ((bellyScale - 1) * bellyWidth) / 2;
  const scaledHeight = bellyHeight * bellyScale;

  return (
    <div className="border-4 border-gray-800 rounded-xl p-4 bg-white shadow-md w-[300px] mx-auto">
      <div className="relative w-[300px] h-[360px] mx-auto">
        {/* Head (185x141) centered */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[185px] h-[141px] z-10">
          <Image src="/cat-head.png" alt="Cat Head" fill className="object-contain" />
        </div>

        {/* Belly wrapper - centered */}
        <div
          className="absolute top-[123px] left-1/2 -translate-x-1/2 z-0 origin-top"
          style={{
            width: `${bellyWidth}px`,
            height: `${bellyHeight}px`,
          }}
        >
          {/* Tail - positioned to move with the right edge of the belly */}
          <div
            className="absolute w-[62px] h-[93px]"
            style={{
              top: scaledHeight * 0.5 - 46, // vertically center-ish
              left: tailOffset,
              transition: "left 0.1s, top 0.3s",
            }}
          >
            <Image src="/cat-tail.png" alt="Tail" fill className="object-contain" />
          </div>

          {/* Scaled belly */}
          <div
            className="absolute top-0 left-0 w-full h-full z-10"
            style={{
              transform: `scale(${bellyScale})`,
              transformOrigin: "top center",
              transition: "transform 0.3s",
            }}
          >
            <Image src="/cat-belly.png" alt="Cat Belly" fill className="object-contain" />
          </div>

          {/* Legs - positioned to stay below the scaled belly */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-[72px] h-[26px] z-10"
            style={{
              top: scaledHeight - 10, // slightly below scaled belly
              transition: "top 0.3s",
            }}
          >
            <Image src="/cat-legs.png" alt="Legs" fill className="object-contain" />
          </div>
        </div>

        {/* Weight Label */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-sm mt-2">Weight: {clampedWeight}</div>
      </div>
    </div>
  );
};
