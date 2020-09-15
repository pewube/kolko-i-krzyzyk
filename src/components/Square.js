import React from "react";

const Square = (props) => (
  <button
    style={
      props.victory.includes(props.index)
        ? { color: "red" }
        : { color: "black" }
    }
    className="game__board__square"
    aria-label={`board button no ${props.index+1}`}
    onClick={props.onClick}>
    {props.value}
  </button>
);

export default Square;