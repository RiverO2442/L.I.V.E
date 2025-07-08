import "../styles.css";
import Audios from "./media-list/audios";
import Images from "./media-list/images";

export default function Media({ headerParams }: any) {
  return (
    <>
      {headerParams?.filter?.mediaType === "image" ? (
        <Images headerParams={headerParams} />
      ) : (
        <Audios headerParams={headerParams} />
      )}
    </>
  );
}
