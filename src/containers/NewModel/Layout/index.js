import React from "react";
import style from "./layout.module.scss";

const Layout = ({ inputs, resultArea, children }) => {
  return (
    <div className={style.infoTabHolder}>
      <div className={style.infoInputArea}>{inputs}</div>
      <div className={style.infoRestArea}>{resultArea}</div>
    </div>
  );
};

export default Layout;
