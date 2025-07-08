import { Pagination } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { imageSearch } from "../../../service/service";
import "../styles.css";

type Pagination = {
  cunrrentPage: number;
  totalItem: number;
};

export default function Images({ headerParams }: any) {
  const navigate = useNavigate();
  const onImageDetail = (id: string) => {
    navigate(`/images/${id}`);
  };
  const [media, setMedia] = useState({
    results: [],
  });
  const [pagination, setPagination] = useState<Pagination>({
    cunrrentPage: 1,
    totalItem: 0,
  });

  const handleGetMedia = async () => {
    try {
      const data = (await imageSearch({
        query: headerParams?.searchParam,
        page: pagination.cunrrentPage,
      })) as any;
      setMedia(data.data);
      setPagination({
        ...pagination,
        totalItem: data.data.result_count,
      });
    } catch (error: any) {
      alert(`${error.response?.data?.message || "Something went wrong."} `);
    }
  };

  useEffect(() => {
    handleGetMedia();
  }, [pagination.cunrrentPage, headerParams?.searchParam]);

  return (
    <div className="p-2 bg-[#C6DBDD] rounded-[6px] flex flex-col items-center gap-3">
      <div className="flex flex-wrap gap-1.5 h-fit bg-white">
        {media?.results?.length > 0 &&
          media["results"].map((item: any) => (
            <img
              key={item?.id}
              onClick={() => {
                onImageDetail(item?.id);
              }}
              className="media-img"
              src={`${item?.url}`}
              alt={item?.title}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = "/no-image.png";
              }}
            />
          ))}
      </div>
      <Pagination
        align="center"
        defaultCurrent={1}
        total={pagination.totalItem ?? 0}
        pageSize={20}
        pageSizeOptions={[20]}
        onChange={(v: any) => {
          setPagination({
            ...pagination,
            cunrrentPage: v,
          });
        }}
      />
    </div>
  );
}
