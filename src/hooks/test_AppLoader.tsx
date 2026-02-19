// // AppLoader.tsx
// import { useEffect } from "react";
// import { useLoader } from "../context/LoaderProvider";
// import { preloadVideo } from "./PreloadVideos";


// const AppLoader = () => {
//   const { setReady, setAssets } = useLoader();

//   useEffect(() => {
//       Promise.all([
//           preloadVideo("/assets/video/swarn.webm"),
//           preloadGLTF("/models/swan.glb"),
//           preloadGLTF("/models/feather.glb"),
//       ]).then(([heroVideo, swan, feather]) => {
//           setAssets({ heroVideo, swan, feather });
//           setReady(true);
//       });
//   }, []);

//   return null;
// };

// export default AppLoader;
