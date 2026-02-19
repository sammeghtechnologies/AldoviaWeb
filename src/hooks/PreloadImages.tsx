// loader/hooks/PreloadImages.ts
export const PreloadImage = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.src = src;

        img.onload = () => resolve(img);
        img.onerror = reject;
    });
