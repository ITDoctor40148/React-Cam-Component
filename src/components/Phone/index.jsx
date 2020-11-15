import React from "react";
import { Rnd } from "react-rnd";

import { Camera } from "react-cam";

import "react-resizable/css/styles.css";
import "./index.scss";

// function capture(imgSrc) {
//   console.log(imgSrc);
// }

const Phone = () => {
    const [captured, setCaptured] = React.useState("");
    // const capture = React.useCallback((imgSrc) => {
    //     console.log(imgSrc);
    // }, [])
  const cam = React.useRef(null);
  return (
    <div>
      <Rnd
        default={{
          x: 50,
          y: 50,
          width: 320,
          height: 690,
        }}
        minWidth={320}
        minHeight={690}
        className="box"
      >
        <div style={{ height: "100%", width: "100%" }}>
          <div className="close">x</div>
          <Camera
            showFocus={true}
            front={false}
            capture={(img) => setCaptured(img)}
            ref={cam}
            width="80%"
            height="auto"
            focusWidth="80%"
            focusHeight="60%"
            btnColor="white"
          />
          <div>
            <p className="text-center">01:23</p>
            <div className="button-group">
              <div className="btn-circle">
                <img alt="Preview" src={captured} />
              </div>
              <div
              className="btn-circle"
                onClick={(img) => {
                  console.log("abcdef");
                  cam.current.capture(img);
                }}
              >
                2
              </div>
              <div className="btn-circle">3</div>
            </div>
          </div>
        </div>
      </Rnd>
    </div>
  );
};

export default Phone;
