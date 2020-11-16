import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import "./popupComponent.scss"

import { removeLink } from '../../store/links-action';

const Modal = ({ handleClose, show, links, removeLink }) => {
  const video = React.useRef(null);
  const [play, setPlay] = React.useState(false);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  const toggle = React.useCallback(() => {
    if (!video.current) return;
    if (!play) {
      video.current.play();
      setPlay(true);
    } else {
      video.current.pause();
      setPlay(false);
    }
  })

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <div className="video-center">
          <div className="modal-close" onClick={() => {removeLink(currentImageIndex)}}>x</div>
          {links[currentImageIndex] && links[currentImageIndex].substring(0, 4) === "data" && <img src={links[currentImageIndex]} alt="Saved Data" />}
          {links[currentImageIndex] && links[currentImageIndex].substring(0, 4) === "blob" &&
            <video ref={video} className="w-100" controls src={links[currentImageIndex]} title="Saved Data">
              <source src={links[currentImageIndex]} type="video/webm" />
            </video>}
          <div className="w-100 d-flex justify-content-between text-white display-6">
            <div onClick={() => setCurrentImageIndex(Math.abs((currentImageIndex - 1) % links.length))}>&lt;</div>
            <div onClick={() => { toggle() }}>{play ? "Pause" : "Play"}</div>
            <div onClick={() => setCurrentImageIndex((currentImageIndex + 1) % links.length)}>&gt;</div>
          </div>
          <button style={{
            width: "100%",
            bottom: "10px",
            border: "0px",
            backgroundColor: "#dd3b3b",
            height: "50px",
            color: "white"
          }} onClick={() => handleClose()}>Back</button>
        </div>
      </section>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    links: state.links
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    removeLink: (index) => {
      dispatch(removeLink(index))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal);