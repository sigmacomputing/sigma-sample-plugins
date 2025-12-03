import { useEffect, useRef } from "react";
import "./App.css";

async function requestCameraAccess(containerRef: HTMLDivElement | null) {
  if (!containerRef) return;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    // Camera access granted, you can now use the stream
    // For example, attach it to a video element:
    const videoElement = document.createElement("video");
    videoElement.srcObject = stream;
    videoElement.play();
    containerRef.appendChild(videoElement);
    return videoElement;
  } catch (err) {
    // Camera access denied or an error occurred
    console.error("Error accessing camera:", err);
    alert(
      "Camera access denied or an error occurred. Please enable camera permissions for this site in your browser settings."
    );
  }
}

function cleanupVideo(
  containerRef: HTMLDivElement | null,
  element: HTMLElement | undefined
) {
  if (!containerRef || !element) return;
  containerRef.removeChild(element);
}

function App() {
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const videoContainer = videoContainerRef.current;
    const videoElementPromise = requestCameraAccess(videoContainer);

    return () => {
      videoElementPromise.then((videoElement) =>
        cleanupVideo(videoContainer, videoElement)
      );
    };
  }, []);

  return (
    <div>
      <div ref={videoContainerRef}></div>
    </div>
  );
}

export default App;
