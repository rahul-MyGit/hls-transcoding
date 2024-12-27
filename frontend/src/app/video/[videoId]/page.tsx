"use client";

import VideoJS from "@/components/main/video";
import { Button } from "@/components/ui/button";
import React, { useRef, useState } from "react";

const VideoPage = ({ params }: { params: { videoId: string } }) => {
  const source = `https://s3.ap-south-1.amazonaws.com/hls-prod.rahulgujjar/${params.videoId}`;
  const playerRef = useRef(null);
  const [resolution, setResolution] = useState(360);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    plugins: {
      qualityLevels: {
        default: "auto",
      },
    },
    sources: [
      {
        src: `${source}/output_${resolution}p/hls_${resolution}p.m3u8`,
        type: "application/x-mpegURL",
      },
    ],
  };

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;

    player.on("waiting", () => {
      console.log("player is waiting");
    });

    player.on("dispose", () => {
      console.log("player will dispose");
    });
  };

  return (
    <div className="container p-10">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold">Video</h1>
        <p className="text-2xl font-bold">{params.videoId}</p>
      </div>

      <div className="max-w-screen-md mx-auto mt-10 rounded-lg overflow-hidden">
        <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
      </div>

      <div className="flex gap-3 items-center justify-center mt-5">
        <Button onClick={() => setResolution(360)}>360p</Button>
        <Button onClick={() => setResolution(480)}>480p</Button>
        <Button onClick={() => setResolution(720)}>720p</Button>
      </div>
    </div>
  );
};

export default VideoPage;