import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface VideoBackgroundProps {
  src?: string;
  className?: string;
  preload?: "auto" | "metadata" | "none";
}

export const VideoBackground = ({
  src,
  className = "",
  preload = "auto",
}: VideoBackgroundProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isHlsSource = Boolean(src?.endsWith(".m3u8"));

  useEffect(() => {
    if (!src || !videoRef.current || !isHlsSource) return;

    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => hls.destroy();
    }

    video.src = src;
  }, [isHlsSource, src]);

  return (
    <video
      ref={videoRef}
      src={isHlsSource ? undefined : src}
      autoPlay
      muted
      loop
      playsInline
      preload={preload}
      aria-hidden="true"
      disablePictureInPicture
      className={`h-full w-full object-cover ${className}`}
    />
  );
};
