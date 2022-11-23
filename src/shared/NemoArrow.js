import { makeStyles } from "@material-ui/core";
import React from "react";

/**
 *
 * @param {direction} accepts a string that can be either "left", "right", "up", or "down"
 * @returns
 */

const useStyle = makeStyles((theme) => ({
  arrow: {
    display: "inline-block",
    width: "7px",
    height: "7px",
    background: "transparent",
    textIndent: "-9999px",
    borderTop: "2px solid #333",
    borderLeft: "2px solid #333",
    transition: "all 250ms ease-in-out",
    textDecoration: "none",
    color: "transparent",

    "&.prev": {
      transform: `rotate(-45deg)`,
    },
    "&.next": {
      transform: `rotate(135deg)`,
    },
    "&.up": {
      transform: `rotate(45deg)`,
    },
    "&.down": {
      transform: `rotate(-135deg)`,
    },

    "&:before": {
      display: "block",
      height: "200%",
      width: "200%",
      marginLeft: "-50%",
      marginTop: "-50%",
      content: "",
      transform: "rotate(45deg)",
    },
  },
}));

const NemoArrow = ({ direction = "down", className = "" }) => {
  const classes = useStyle();
  return (
    <div
      className={`${classes.arrow} ${direction} ${className}`}
      title={direction}
    />
  );
};

export default NemoArrow;
