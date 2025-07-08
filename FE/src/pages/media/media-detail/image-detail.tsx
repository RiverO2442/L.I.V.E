import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { imageDetail } from "../../../service/service";

const ImageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Retrieve the image ID from the URL
  const [media, setMedia] = useState<any>();
  const handleGetMediaDetail = async () => {
    try {
      const data = (await imageDetail(id)) as any;
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
          {media?.title ?? "Image"}
        </h1>
        {media?.url && (
          <img
            src={media?.url ?? "/"}
            alt={`Image ${id}`}
            className="h-auto mt-4 border border-black object-fit max-w-[1000px] max-h-[1000px]"
            onError={(e) => {
              e.currentTarget.src = "public/no-image.png";
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ImageDetail;
