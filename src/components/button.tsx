import React from "react";
// import { Button } from 'react-bootstrap'

interface Props {
  text: string;
  onClick?: () => void;
  className?: string;
  variant?: string;
  value?: string;
}

export function Button(props: Props): JSX.Element {
  return (
    <button className={props.className} onClick={props.onClick}>
      {props.text}
    </button>
  );
}
