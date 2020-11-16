import React from "react";
import { connect } from "react-redux";

import { Rnd } from "react-rnd";
import Webcam from "react-webcam";
import CountUp, { useCountUp } from 'react-countup';

import "react-resizable/css/styles.css";

import Modal from "../Modal";

import "./index.scss";
import CameraIcon from "../camera.svg";

import { addLink } from "../../store/links-action";

const secToTime  = (sec) => {
  const m = Math.floor(sec / 60);
  const s = sec - m * 60;

  const min = m < 10 ? "0" + m : m;
  const secs = s < 10 ? "0" + s : s;
  return min + ":" + secs;
}

const Phone = (props) => {
  const [timerID, setTimerID] = React.useState(-1);
  const [elapsed, setElapsed] = React.useState(0);
  const [clickTime, setClickTime] = React.useState(0);
  const [show, setShow] = React.useState(false);

  const webcamRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);
  const [capturing, setCapturing] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);

  const [deviceId, setDeviceId] = React.useState(0);
  const [devices, setDevices] = React.useState([]);

  const { countUp, start, pauseResume, reset, update } = useCountUp({
    start: 0,
    end: 1000,
    delay: 0,
    duration: 10000,
    onReset: () => console.log('Resetted!'),
    onUpdate: () => console.log('Updated!'),
    onPauseResume: () => console.log('Paused or resumed!'),
    onStart: ({ pauseResume }) => console.log(pauseResume),
    onEnd: ({ pauseResume }) => console.log(pauseResume),
  });

  const handleDevices = React.useCallback(
    (mediaDevices) =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    [setDevices]
  );

  React.useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  const capture = React.useCallback(
    (flag = false) => {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;
      setImgSrc(imageSrc);
      if (!flag) props.addLink(imageSrc);
    },
    [webcamRef, setImgSrc]
  );

  const handleStartCaptureClick = React.useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
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
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      setImgSrc(url);
      props.addLink(url);
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
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-100 h-75"
            videoConstraints={
              devices.length ? { deviceId: devices[deviceId].deviceId } : null
            }
          />
          <div className="buttons">
            {capturing && <p className="text-center text-white timer">{secToTime(countUp)}</p>}
            <div className="button-group">
              <div className="btn-circle" onClick={() => setShow(true)}>
                {imgSrc && imgSrc.substring(0, 4) === "data" && (
                  <img src={imgSrc} alt="turn camera" />
                )}
                <p className="text-white">{props.links.length}</p>
              </div>
              <div
                className="btn-capture"
                onMouseLeave={() => setClickTime(new Date().getTime())}
                onMouseUp={() => {
                  const now = new Date().getTime();
                  if (now - clickTime > 200) {
                    if (!capturing) {
                      start();
                      handleStartCaptureClick();
                    } else {
                      update(0);
                      handleStopCaptureClick();
                      handleDownload();
                      capture(true);
                    }
                  } else {
                    if (!capturing) capture();
                  }
                }}
                onMouseDown={() => setClickTime(new Date().getTime())}
              />
              <div
                className="btn-circle"
                onClick={() => {
                  if (devices.length) setDeviceId((deviceId + 1) % devices.length);
                }}
              >
                <img src={CameraIcon} alt="Toggling" />
              </div>
            </div>
          </div>
        </div>
        <Modal show={show} handleClose={() => setShow(false)} />
      </Rnd>
    </div>
  );
};

const mapStateToProps = (state) => ({
  links: state.links
})

const mapDispatchToProps = (dispatch) => {
  return {
    addLink: (link) => {
      dispatch(addLink(link));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Phone);
