import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import "./popupComponent.scss"
const Modal = ({ handleClose, show, links }) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <div className="modal-close">x</div>
        <div>
          {links.length !== 0 && links[currentImageIndex].substring(0, 4) === "data" && <img src={links[currentImageIndex]} alt="Saved Data" />}
          {links.length !== 0 && links[currentImageIndex].substring(0, 4) === "blob" && <video controls src={links[currentImageIndex]} title="Saved Data" >
            <source src={links[currentImageIndex]} type="video/webm" />
          </video>}
        </div>
        <div className="w-100 d-flex justify-content-between text-white display-6">
          <div onClick={() => setCurrentImageIndex(Math.abs((currentImageIndex - 1) % links.length))}>&lt;</div>
          <div onClick={() => setCurrentImageIndex((currentImageIndex + 1) % links.length)}>&gt;</div>
        </div>
        <button style={{
          width: "100%",
          bottom: "10px",
          position: "absolute",
          border: "0px",
          backgroundColor: "#dd3b3b",
          height: "50px",
          color: "white"
        }} onClick={() => handleClose()}>Back</button>
      </section>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    links: state.links
  }
}

export default connect(mapStateToProps)(Modal);