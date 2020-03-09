import React from 'react';
import SVG from 'react-tweenful/SVG';

const SvgDemo = () => {
  return (
    <svg
      height="300"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 400 400"
    >
      <SVG.path
        duration={3000}
        easing="easeInQuad"
        style={{ fill: "#fff", transform: 'scale(4)' }}
        animate={[{ strokeDashoffset: [100, 0] }, { fill: '#b91e1e' }]}
        stroke="#b91e1e"
        strokeWidth="2"
        fill="none"
        d="M61.9,55.4c-2.3-3.5-3.6-7.7-3.6-12.2c0-4.7,1.5-9.1,4-12.7c2.1,3.1,3.4,6.7,3.7,10.7h13  C78.2,24,65,10.1,48.1,8.2l-3.8-6.6l-3.8,6.6C23.5,10.1,10.3,24,9.5,41.3h13c0.3-3.9,1.6-7.6,3.7-10.7c2.5,3.6,4,8,4,12.7  c0,4.5-1.4,8.7-3.7,12.2c-2.3-3.2-3.8-7-4-11.2h-13c0.8,18.5,16,33.3,34.7,33.3S78.2,62.7,79,44.3h-13  C65.7,48.4,64.2,52.2,61.9,55.4z M36,62.9c3.9-5.6,6.2-12.3,6.2-19.6c0-7.6-2.5-14.7-6.8-20.4c2.7-1.2,5.6-1.9,8.8-1.9  c3.1,0,6.1,0.7,8.8,1.9c-4.2,5.7-6.8,12.7-6.8,20.4c0,7.3,2.3,14.1,6.2,19.6c-2.5,1-5.3,1.6-8.2,1.6C41.3,64.5,38.6,63.9,36,62.9z"
      />
    </svg>
  );
};

export default SvgDemo;