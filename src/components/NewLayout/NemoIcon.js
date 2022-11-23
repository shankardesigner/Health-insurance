import React from "react";
import IcomoonReact from "icomoon-react";
import iconSet from "../../styles/icomoon.json";

const NemoIcon = ({ color='#6F7376', size = 24, icon, className }) => {
  return (
    <IcomoonReact
      className={className}
      iconSet={iconSet}
      color={color}
      size={size}
      icon={icon}
    />
  );
};

export default NemoIcon;
