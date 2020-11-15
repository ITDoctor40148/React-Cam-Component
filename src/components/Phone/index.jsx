import React from "react";
import { Rnd } from "react-rnd";

import Webcam from "react-webcam";

import "react-resizable/css/styles.css";

import "./index.scss";
import camera from "../camera.svg";

// function capture(imgSrc) {
//   console.log(imgSrc);
// }

const Phone = () => {
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);
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
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
          <div>
            <p className="text-center">01:23</p>
            <div className="button-group">
              <div className="btn-circle">
                {imgSrc && <img alt="Preview" src={imgSrc} />}
              </div>
              <div
                className="btn-capture"
                onClick={capture}
              />
              <div className="btn-circle">
                <img src={camera} alt="turn camera" />
              </div>
            </div>
          </div>
        </div>
      </Rnd>
    </div>
  );
};

export default Phone;
