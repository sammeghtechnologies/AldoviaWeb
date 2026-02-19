import { useMemo } from "react";

function importAll(glob: Record<string, unknown>) {
  const mapped: Record<string, string> = {};
  for (const path in glob) {
    const key = path.split("/").pop()?.split(".")[0] || "";
    mapped[key] = glob[path] as string;
  }
  return mapped;
}

const images = import.meta.glob(
  "../assets/images/*.{png,jpg,jpeg,svg,gif,webp}",
  {
    eager: true,
    import: "default",
  }
);

const icons = import.meta.glob("../assets/icons/*.{svg,png,gif}", {
  eager: true,
  import: "default",
});

const backgrounds = import.meta.glob(
  "../assets/backgrounds/*.{png,jpg,jpeg,webp,svg}",
  {
    eager: true,
    import: "default",
  }
);

const videos = import.meta.glob("../assets/videos/*.{webm,mp4}", {
  eager: true,
  import: "default",
});

const lottie = import.meta.glob("../assets/lottie/*.{json}", {
  eager: true,
  import: "default",
});

export const useAssets = () => {
  return useMemo(() => {
    return {
      images: importAll(images),
      icons: importAll(icons),
      backgrounds: importAll(backgrounds),
      lottie: importAll(lottie),
      videos: importAll(videos),
    };
  }, []);
};
