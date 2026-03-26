import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface VideoBackgroundProps {
  src?: string;
  className?: string;
}

export const VideoBackground = ({ src, className = "" }: VideoBackgroundProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!src || !videoRef.current) return;

    const video = videoRef.current;

    if (Hls.isSupported() && src.endsWith(".m3u8")) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      video.src = src;
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      className={`w-full h-full object-cover ${className}`}
    />
  );
};
