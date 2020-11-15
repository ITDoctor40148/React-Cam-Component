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
  const mediaRecorderRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);
  const [capturing, setCapturing] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  const handleStartCaptureClick = React.useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm"
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm"
      });
      const url = URL.createObjectURL(blob);
      setImgSrc(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

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
                onLongClick={() => { 
                  if (!capturing) {
                    setCapturing(true);
                    handleStartCaptureClick();
                  } else {
                    setCapturing(false);
                    handleStopCaptureClick();
                    handleDownload();
                  }
                }}
              />
              <div className="btn-circle">
                {
                  camera.split(0, 4) === "data" && <img src={camera} alt="turn camera" />
                }
                {
                  camera.split(0, 4) === "blog" && <iframe src={camera} title="video" alt="turn camera" allow="camera; microphone;" />
                }
              </div>
            </div>
          </div>
        </div>
      </Rnd>
    </div>
  );
};

export default Phone;
