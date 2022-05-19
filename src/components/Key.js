import { React, useContext } from "react";
import { AppContext } from "../App";

function Key({ keyVal, bigKey, disabled }) {
  const {
    onEnter,
    onSelect,
    onDelete,
  } = useContext(AppContext);

  function selectLetter() {
    if (keyVal === "ENTER") {
      onEnter();
    } else if (keyVal === "DELETE") {
      onDelete();
    } else {
      onSelect(keyVal);
    }
  }
  return (
    <div className="key" id={bigKey ? "big" : disabled && "disabled"} onClick={() => 
{    if (disabled) return;
      selectLetter()}}
    >
      {keyVal}
    </div>
  );
}

export default Key;
