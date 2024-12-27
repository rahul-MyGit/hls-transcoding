"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isDropping, setIsDropping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      return;
    }
    setIsUploading(true);
    try {
      const urlResponse = await fetch("http://localhost:4000/api/v1/upload", {
        method: "POST",
        body: JSON.stringify({ filename: file?.name }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await urlResponse.json();
      const presignedUrl = json.url;

      const response = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file?.type,
        },
      });

      if (response.ok) {
        toast.success("Video uploaded successfully");
        setIsUploading(false);
        const res = await fetch(
          `http://localhost:4000/api/v1/video/updateStatus`,
          {
            method: "POST",
            body: JSON.stringify({ id: file?.name }),
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const json = await res.json();
        console.log(json);
        getAllVideos();
      } else {
        setIsUploading(false);
        toast.error("Failed to upload video");
      }
    } catch (error) {
      setIsUploading(false);
      console.error("Error:", error);
    }
  };

  const getAllVideos = async () => {
    const res = await fetch("http://localhost:4000/api/v1/video/all");
    const json = await res.json();
    setVideos(json?.videos);
  };

  const startPolling = () => {
    const intervalId = setInterval(() => {
      getAllVideos();
    }, 5000);

    setIntervalId(intervalId);
  };

  const stopPolling = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  useEffect(() => {
    getAllVideos();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto py-12 md:py-20 lg:py-10">
      <div className="grid gap-8 md:gap-12 lg:gap-8">
        <div className="grid gap-4 md:gap-6 lg:gap-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Video Platform
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-[700px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Upload videos by dragging and dropping them. We&apos;ll
            automatically convert them to HLS format for seamless playback.
          </p>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 md:p-8 lg:p-10 grid gap-6 md:gap-8 lg:gap-10">
          <label htmlFor="video" className="cursor-pointer">
            <div
              className="flex items-center justify-center mx-40 aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg"
              onDragOver={(event) => {
                event.preventDefault();
                setIsDropping(true);
              }}
              onDrop={(event) => {
                event.preventDefault();
                setIsDropping(false);
                const files = event.dataTransfer.files;

                if (files.length) {
                  const file = files[0];
                  if (file.type.includes("video/")) {
                    setFile(file);
                  } else {
                    toast.error("Invalid file type, only videos are supported");
                  }
                }
              }}
            >
              <div className="flex flex-col items-center justify-center space-y-4">
                <CloudUploadIcon className="w-10 h-10 text-gray-500 dark:text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400">
                  {isDropping
                    ? "Dropping..."
                    : "Drag and drop your videos here"}
                </p>
                <input
                  className="hidden"
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                />
                <p>{file?.name}</p>
                <div>
                  <Button
                    variant="outline"
                    onClick={handleUpload}
                    disabled={isUploading || !file}
                  >
                    {isUploading ? "Uploading..." : "Upload Video"}
                  </Button>
                </div>
              </div>
            </div>
          </label>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Button onClick={getAllVideos}>Refresh</Button>
              {intervalId ? (
                <Button onClick={stopPolling} variant={"destructive"}>
                  Stop Polling
                </Button>
              ) : (
                <Button onClick={startPolling}>Start Polling</Button>
              )}
            </div>

            {videos?.map((video: any) => (
              <div
                key={video.key}
                className="flex justify-between items-center"
              >
                <Link
                  href={`/video/${video.key
                    ?.replace("video:", "")
                    ?.replace(":status", "")}`}
                >
                  <Button variant={"link"}>
                    {video.key?.replace("video:", "")?.replace(":status", "")}
                  </Button>
                </Link>
                <span
                  className={`ml-2 font-semibold uppercase ${
                    video.status === "processed"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {video.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CloudUploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  );
}