import React from 'react'

const styles = {
  text: {
    marginTop: 52,
    color: "#888",
    marginLeft: 6
  },
  spinner: {
    backgroundColor: "rgba(255, 255, 255, 0.0)",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 100000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
};

const Loader = ({loading, fullPage, containerStyle}) => {
  if (!loading) {
    return null;
  }
  const mergedContainerStyle = {
    ...styles.spinner,
    ...containerStyle,
    position: fullPage ? "fixed" : "absolute"
  };
  return (
    <div style={mergedContainerStyle}>
      <div className="sk-circle">
        <div className="sk-circle1 sk-child"/>
        <div className="sk-circle2 sk-child"/>
        <div className="sk-circle3 sk-child"/>
        <div className="sk-circle4 sk-child"/>
        <div className="sk-circle5 sk-child"/>
        <div className="sk-circle6 sk-child"/>
        <div className="sk-circle7 sk-child"/>
        <div className="sk-circle8 sk-child"/>
        <div className="sk-circle9 sk-child"/>
        <div className="sk-circle10 sk-child"/>
        <div className="sk-circle11 sk-child"/>
        <div className="sk-circle12 sk-child"/>
      </div>
    </div>
  );
};

export default Loader;
