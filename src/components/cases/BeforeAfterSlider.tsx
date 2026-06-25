"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

const ReactCompareImage = dynamic(() => import("react-compare-image"), {
  ssr: false,
  loading: () => (
    <div className="aspect-square bg-neutral-100 animate-pulse rounded-xl flex items-center justify-center">
      <span className="text-neutral-400 text-sm">Loading...</span>
    </div>
  ),
});

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  aspectRatio?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  aspectRatio = "aspect-square",
}: BeforeAfterSliderProps) {
  return (
    <div className={`relative ${aspectRatio} rounded-xl overflow-hidden bg-neutral-100`}>
      <ReactCompareImage
        leftImage={beforeImage}
        rightImage={afterImage}
        leftImageLabel={beforeLabel}
        rightImageLabel={afterLabel}
        sliderLineColor="#14b8a6"
        sliderLineWidth={3}
        handle={
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "#14b8a6",
              border: "3px solid white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              cursor: "grab",
            }}
          />
        }
      />
    </div>
  );
}