// loader/hooks/PreloadVideos.ts
export const PreloadVideo = (src: string) =>
    new Promise<HTMLVideoElement>((resolve, reject) => {
        const video = document.createElement("video");
        video.src = src;
        video.preload = "metadata";
        video.muted = true;
        video.playsInline = true;

        video.onloadedmetadata = () => resolve(video);
        video.onerror = reject;
    });
