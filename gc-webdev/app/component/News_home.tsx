import React, { useEffect, useState } from "react";
import Card from "./NewsCard";
import Link from "next/link";

interface VideoItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
}

const News_home = () => {
  const [cnnVideos, setCnnVideos] = useState<VideoItem[]>([]);
  const [bbcVideos, setBbcVideos] = useState<VideoItem[]>([]);
  const [error, setError] = useState<string | null>(null); // State for error handling

  useEffect(() => {
    // Helper function to fetch videos
    const fetchVideos = async (url: string, setVideos: React.Dispatch<React.SetStateAction<VideoItem[]>>) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setVideos(data.items);
      } catch (error) {
        setError('API over limit'); // Set error message
      }
    };

    // Fetch CNN and BBC videos
    fetchVideos(
      "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCupvZG-5ko_eiXAupbDfxWw&maxResults=10&order=date&key=AIzaSyDpref1bV9m7s7igwJqZG1JhC_gsXX60L0", //AIzaSyC9xzdwpLokZiHo9JFXFpTHFVoLCu1o5ak,
      setCnnVideos
    );

    fetchVideos(
      "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UC16niRr50-MSBwiO3YDb3RA&maxResults=10&order=date&key=AIzaSyDpref1bV9m7s7igwJqZG1JhC_gsXX60L0",
      setBbcVideos
    );
  }, []);

  return (
    <div className="flew w-[100%] mt-10 mb-10">
      {error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <>
          <div className="flex flex-row center items-center ml-20 mr-20">
            <div className="w-[15%] font-bold">CNN News</div>
            <div className="w-[85%] h-[320px] items-center flex flex-row overflow-x-auto whitespace-nowrap pl-1">
              {cnnVideos.map((video) => (
                <Link
                  href={{
                    pathname: `/dictation`,
                    query: {
                      title: video.snippet.title,
                      url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
                      thumbnail: video.snippet.thumbnails.medium.url,
                      key: video.id.videoId
                    },
                  }}
                  key={video.id.videoId}
                  passHref
                >
                  <Card
                    key={video.id.videoId}
                    title={video.snippet.title}
                    url={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                    thumbnail={video.snippet.thumbnails.medium.url}
                  />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-row center items-center ml-20 mr-20">
            <div className="w-[15%] font-bold">BBC News</div>
            <div className="w-[85%] h-[320px] items-center flex flex-row overflow-x-auto whitespace-nowrap pl-1">
              {bbcVideos.map((video) => (
                <Link href={`/dictation`} key={video.id.videoId} passHref>
                  <Card
                    key={video.id.videoId}
                    title={video.snippet.title}
                    url={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                    thumbnail={video.snippet.thumbnails.medium.url}
                  />
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default News_home;
