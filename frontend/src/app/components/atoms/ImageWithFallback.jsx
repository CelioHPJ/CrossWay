import { useState, useEffect } from "react";

export function ImageWithFallback({ src, fallbackSrc, ...props }) {
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
        setImgSrc(src);
    }, [src]);

    const handleError = () => {
        setImgSrc(fallbackSrc);
    };

    return <img src={imgSrc || fallbackSrc} onError={handleError} {...props} />;
}
