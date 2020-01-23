import React from 'react';
import SVG from 'react-tweenful/SVG';

const SvgDemo = () => {
  return (
    <svg
      height="300"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 404.7 354"
    >
      <SVG.path
        duration={3000}
        easing="easeInQuad"
        style={{ fill: "#fff" }}
        animate={[{ strokeDashoffset: [100, 0] }, { fill: '#b91e1e' }]}
        stroke="#b91e1e"
        strokeWidth="6"
        fill="none"
        d="M366.2,204.2c-9.8,0-15-5.6-15-15.1V77.2h-85v28h19.5c9.8,0,8.5,2.1,8.5,11.6v72.4c0,9.5,0.5,15.1-9.3,15.1H277h-20.7c-8.5,0-14.2-4.1-14.2-12.9V52.4c0-8.5,5.7-12.3,14.2-12.3h18.8v-28h-127v28h18.1c8.5,0,9.9,2.1,9.9,8.9v56.1h-75V53.4c0-11.5,8.6-13.3,17-13.3h11v-28H2.2v28h26c8.5,0,12,2.1,12,7.9v142.2c0,8.5-3.6,13.9-12,13.9h-21v33h122v-33h-11c-8.5,0-17-4.1-17-12.2v-57.8h75v58.4c0,9.1-1.4,11.6-9.9,11.6h-18.1v33h122.9h5.9h102.2v-33H366.2z"
      />
    </svg>
  );
};

export default SvgDemo;