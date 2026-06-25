declare module "react-compare-image" {
  import { FC } from "react";

  interface ReactCompareImageProps {
    leftImage: string;
    rightImage: string;
    leftImageLabel?: string;
    rightImageLabel?: string;
    sliderLineColor?: string;
    sliderLineWidth?: number;
    handle?: React.ReactNode;
    className?: string;
  }

  const ReactCompareImage: FC<ReactCompareImageProps>;
  export default ReactCompareImage;
}