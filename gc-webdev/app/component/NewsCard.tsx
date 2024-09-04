import React, { useEffect } from 'react';
import Link from 'next/link'
// import { useRouter, NextRouter } from 'next/router';
import { useRouter } from 'next/navigation';

interface NewsCardProps {
    title: string;
    url: string;
    thumbnail: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ title, url, thumbnail }) => {
    const router = useRouter();
    const encodedUrl = encodeURIComponent(url);
    // const href = {
    //     pathname: '/dictation',
    //     query: {
    //         url: encodedUrl,
    //         cardType: 'news',
    //     },
    // };

    const handleClick = () => {
        router.push(`/dictation?url=${encodedUrl}&cardType=news`);
    }

    useEffect(() => {
        console.log(encodedUrl);
      }, []);
    
    return (
        <div onClick={handleClick} className="w-[320px] h-[180px] shadow-md mr-5 rounded-lg flex-shrink-0">
            {/* <Link href={href} target="_blank" rel="noopener noreferrer" passHref> */}
                <img 
                    src={thumbnail} 
                    alt={title} 
                    className="w-full h-full object-cover" 
                />
            {/* </Link> */}
        </div>
    );
}

export default NewsCard;