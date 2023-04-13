import React from 'react';
import Masonry from "react-masonry-css";
import Pin from "./Pin";
import {IPin} from "../type/pin";

interface MasonryLayoutProps {
  pins: IPin[]
}

const MasonryLayout: React.FC<MasonryLayoutProps> = ({pins}) => {
  const breakpointObj = {
    default: 4,
    3000: 6,
    2000: 5,
    1200: 3,
    1000: 2,
    500: 1
  }
  return (
    <Masonry className="flex animate-slide-fwd"
             breakpointCols={breakpointObj}>
      {pins.map(pin =>
        <Pin key={pin?._id}
             pin={pin}/>
      )}
    </Masonry>
  );
};

export default MasonryLayout;