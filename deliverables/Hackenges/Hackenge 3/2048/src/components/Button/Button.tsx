import React from "react";
import "./button.less";

type Props = {
  children: any;
  onClick?: () => void;
};

export const Button = ({ children, onClick }: Props) => {
  return (
    <button className="css-button-3d--black" onClick={onClick}>
      {children}
    </button>
  );
};
