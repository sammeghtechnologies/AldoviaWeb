// loader/AppLoader.tsx
import { useEffect } from "react";
import { useLoader } from "./context/LoaderProvider";
import { PreloadModels } from "./hooks/PreloadsModels";
import { PreloadVideo } from "./hooks/PreloadVideos";
import { PreloadImage } from "./hooks/PreloadImages";

const AssetLoader = () => {
    const { setReady, setAssets } = useLoader();

    useEffect(() => {
        const load = async () => {
            try {
                // 1️⃣ Preload GLTFs (cache)
                PreloadModels();

                // 2️⃣ Preload videos
                const [heroVideo] = await Promise.all([
                    PreloadVideo("/assets/video/swarn.webm"),
                ]);

                // 3️⃣ Preload images
                const [logoImage] = await Promise.all([
                    PreloadImage("/assets/logo/aldovialogo.svg"),
                ]);

                // 4️⃣ Store assets centrally
                setAssets({
                    videos: {
                        hero: heroVideo,
                    },
                    images: {
                        logo: logoImage,
                    },
                });

                // ✅ Everything ready
                setReady(true);
            } catch (err) {
                console.error("Asset preload failed:", err);
                setReady(true); // fail-open
            }
        };

        load();
    }, []);

    return null;
};

export default AssetLoader;
