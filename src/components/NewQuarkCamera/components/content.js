import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import videojs from 'video.js';
import 'webrtc-adapter';
import RecordRTC from 'recordrtc';
// import Record from 'videojs-record/dist/videojs.record.js';

import Modal from './popupComponent'
import "./contentStyle.scss";

import camera from './camera.svg';

class VideoContent extends Component {
    state = {
        showPopup: false,
        Mediadivces: [],
        images: [],
        currentImageIndex: 0
    };
    componentDidMount() {
        // instantiate Video.js
        this.player = videojs(this.videoNode, this.props, () => {
            // print version information at startup
            const version_info = 'Using video.js ' + videojs.VERSION +
                ' with videojs-record ' + videojs.getPluginVersion('record') +
                ' and recordrtc ' + RecordRTC.version;
            videojs.log(version_info);

            // this.player.record().getDevice();
        });
        //console.log(this.player.record().getDevice());
        // device is ready
        this.player.on('deviceReady', () => {
            console.log('device is ready!');
        });

        // user clicked the record button and started recording
        this.player.on('startRecord', () => {
            console.log('started recording!');
        });

        // user completed recording and stream is available
        this.player.on('finishRecord', () => {
            // recordedData is a blob object containing the recorded data that
            // can be downloaded by the user, stored on server etc.

            this.props.componentSetting.on('afterVideoRecord', () => {
                console.log('finished recording: ', this.player.recordedData);
            })
        });

        // error handling
        this.player.on('error', (element, error) => {
            console.warn(error);
        });

        this.player.on('deviceError', () => {
            console.error('device error:', this.player.deviceErrorCode);
        });

        navigator.mediaDevices.enumerateDevices().then((devices) => {
            this.setState({
                Mediadivces: devices
            })
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
    }

    componentWillUnmount() {
        if (this.player) this.player.dispose();
    }

    // Take the photo and present in canvas
    takePhoto = () => {

        // coded by darkTiger
        let images = this.state.images;
        let canvas = document.createElement("canvas");
        canvas.width = this.videoNode.clientWidth;
        canvas.height = this.videoNode.clientHeight;
        canvas.getContext('2d').drawImage(this.videoNode, 0, 0, canvas.width, canvas.height);
        var nImg = new Image();
        nImg.src = canvas.toDataURL();
        images.push(nImg);
        let cur = images.length - 1;

        this.setState({ images: images, currentImageIndex: cur }, () => { console.log("images", this.state.images) });

        const { sendFile } = this.props;
        const context = this.canvas.getContext('2d');
        context.drawImage(this.videoNode, 0, 0, 50, 50);
        console.log(this.props);
        this.canvas.toBlob(() => { return sendFile }, 'image/*');

        const popupContext = this.popupCanvas.getContext('2d');
        console.log(this.videoNode.clientWidth)
        console.log(this.videoNode.clientHeight)
        console.log(this.player.videoWidth())
        console.log(this.player.videoHeight())
        let ratio = this.player.videoHeight() / this.player.videoWidth();
        console.log(ratio)

        console.log(this.videoNode.clientWidth * ratio)

        console.log(this.popupCanvas.width)
        console.log(this.popupCanvas.clientHeight)

        popupContext.drawImage(this.videoNode, 0, 0, this.popupCanvas.width, this.popupCanvas.height);

        this.props.componentSetting.on('afterSnap', () => {
            console.log('finish SnapPhoto');
            //alert("snap");
        })
    };
    popupSnapShot = () => {
        this.setState({
            showPopup: true
        })
        //console.log("poopup") 
    }
    SelectCamera = (deviceId) => {
        this.player.record().recordImage = { deviceId: { exact: deviceId } };
        this.player.record().stopDevice();
        this.player.record().getDevice();
    }
    truncateString = (str, count) => {
        return (str.length > count) ? str.substr(0, count - 1) + '....' : str;
    }

    handlePrev = () => {
        const popupContext = this.popupCanvas.getContext('2d');
        let cur = this.state.currentImageIndex;
        if (cur > 0) cur = cur - 1;
        this.setState({ currentImageIndex: cur });
        popupContext.drawImage(this.state.images[cur], 0, 0, this.popupCanvas.width, this.popupCanvas.height);
    }
    handleNext = () => {
        const popupContext = this.popupCanvas.getContext('2d');
        let cur = this.state.currentImageIndex;
        if (cur < this.state.images.length - 1) cur = cur + 1;
        this.setState({ currentImageIndex: cur });
        popupContext.drawImage(this.state.images[cur], 0, 0, this.popupCanvas.width, this.popupCanvas.height);
    }
    render() {
        console.log(this.state.Mediadivces);
        return (
            <div>
                <video ref={node => this.videoNode = node} className="video-js vjs-default-skin"></video>
                <p style={{ textAlign: 'center' }}>01:23</p>
                <div className="CameraBottom">
                    <div>
                        <div className='toolbtn' onClick={this.popupSnapShot}>
                            <canvas width="50px" height="50px" style={{ borderRadius: '50%' }} ref={ref => (this.canvas = ref)} />
                            <p className="my-0">abc</p>
                        </div>
                    </div>
                    <div className='toolbtn' style={{ width: '60px', height: '60px', boxShadow: '0px 0px 0px 3px black, 0px 0px 3px 3px white' }} onClick={this.takePhoto} />
                    <div className='toolbtn' onClick={this.showCameraList}>
                        <div className="switch-camera"><img src={camera} alt="turn camera" /></div>
                        <div className="deviceList">
                            {
                                this.state.Mediadivces.map((device, index) => {
                                    return (
                                        <div key={index} className="deviceItem" onClick={() => this.SelectCamera(device.deviceId)}>{this.truncateString(device.label, 25)}</div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <Modal show={this.state.showPopup} handleClose={() => { this.setState({ showPopup: false }) }}>
                    <div>
                        <canvas width={`${this.props.width - 6}`} height="auto" ref={ref => (this.popupCanvas = ref)} />
                        <p style={{ fontSize: "24px", color: "white", textAlign: "center" }}>
                            <button style={{
                                float: "left",
                                width: "20%",
                                left: "10px",
                                height: "50px",
                            }} onClick={this.handlePrev}>
                                &lt;
                            </button>
                            {this.state.currentImageIndex + 1} / {this.state.images.length}
                            <button style={{
                                float: "right",
                                width: "20%",
                                right: "10px",
                                height: "50px",
                            }} onClick={this.handleNext}>
                                &gt;
                            </button>
                        </p>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default VideoContent;