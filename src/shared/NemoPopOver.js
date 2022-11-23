import { makeStyles, Popover } from "@material-ui/core";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  paper: {
    background: "#fff",
    // border: "1px solid #06406D",
    boxShadow: `0px 3px 4px rgba(0, 0, 0, 0.1)`,
    borderRadius: "8px",
  }
}));

const NemoPopOver = ({ children, id, open, anchorEl,  onClose, ...props }) => {
  const ref = React.useRef(null);
  const classes = useStyles();

  const handleClick = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      onClose();
    }
    // ref.current = anchorEl;
  };

  return (
    <Popover
      onClick={handleClick}
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      classes={{
        paper: classes.paper,
      }}
      // anchorReference={anchorEl}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'left',
      }}
      // transformOrigin={{
      //   vertical: '215px',
      //   horizontal: '215px',
      // }}
      {...props}
    >
      <div ref={ref}>{children}</div>
    </Popover>
  );
};

export default NemoPopOver;
