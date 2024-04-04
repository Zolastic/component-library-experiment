import React from "react";
import "./Button.css";

type Props = {
  label: string;
};

const Button = ({ label }: Props) => {
  return <button>{label}</button>;
};

export default Button;
