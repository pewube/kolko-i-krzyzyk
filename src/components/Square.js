import React from "react";

const Square = (props) => (
  <button
    style={
      props.victory.includes(props.index)
        ? { color: "red" }
        : { color: "black" }
    }
    className="square"
    onClick={props.onClick}>
    {props.value}
  </button>
);

export default Square;