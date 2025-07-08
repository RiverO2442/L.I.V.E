import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { audioDetail } from "../../../service/service";
import ReactAudioPlayer from "react-audio-player";

const AudioDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Retrieve the image ID from the URL
  const [media, setMedia] = useState<any>();
  const handleGetMediaDetail = async () => {
    try {
      const data = (await audioDetail(id)) as any;
      setMedia(data?.data);
    } catch (error: any) {
      alert(`${error.response?.data?.message || "Something went wrong."} `);
    }
  };

  useEffect(() => {
    handleGetMediaDetail();
  }, []);

  return (
    <div className="flex items-center justify-center w-full bg-black">
      <div className="flex items-center justify-start flex-col gap-2 h-full bg-white p-5">
        <h1 className="text-2xl font-bold text-black underline">
          {media?.title ?? "Audio Title"}
        </h1>
        <img
          src={
            media?.thumbnail ??
            "https://st4.depositphotos.com/14953852/22772/v/450/depositphotos_227725020-stock-illustration-image-available-icon-flat-vector.jpg"
          }
          alt={`Image ${media?.title}`}
          className="h-auto mt-4 border border-black object-fit max-w-[1000px] max-h-[1000px] min-h-[500px] min-w-[500px]"
        />
        {media?.url && (
          <ReactAudioPlayer
            src={
              media?.url ??
              "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            }
            controls
            autoPlay={false}
          />
        )}
      </div>
    </div>
  );
};

export default AudioDetail;
