import { useState, useRef } from "react";
import Webcam from "react-webcam";

export default function Camera() {
  const [showCamera, setShowCamera] = useState(false);
  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);

  const videoConstraints = {
    facingMode: "environment", // use rear camera on mobile
  };

  const handleCapture = () => {
    const screenshot = webcamRef.current.getScreenshot();
    setImage(screenshot);
    setShowCamera(false); // hide preview after capture if you want
    console.log("Captured image:", screenshot);
    // You can send `screenshot` to your backend here
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {!showCamera && !image && (
        <button onClick={() => setShowCamera(true)}>Open Camera</button>
      )}

      {showCamera && (
        <div>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            style={{ width: "100%", maxWidth: 400 }}
          />
          <button onClick={handleCapture} style={{ marginTop: "10px" }}>
            Capture
          </button>
          <button
            onClick={() => setShowCamera(false)}
            style={{ marginTop: "10px", marginLeft: "10px" }}
          >
            Cancel
          </button>
        </div>
      )}

      {image && (
        <div>
          <img
            src={image}
            alt="Captured"
            style={{ width: "100%", maxWidth: 400 }}
          />
          <button
            onClick={() => {
              setImage(null);
              setShowCamera(true);
            }}
            style={{ marginTop: "10px" }}
          >
            Retake
          </button>
        </div>
      )}
    </div>
  );
}
