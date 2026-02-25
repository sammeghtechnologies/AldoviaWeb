import AssetLoader from "./AssetLoader";
import FeatherLoader from "./components/FeatherLoader";
import { useLoader } from "./context/LoaderProvider";
import LandingPage from "./LandingPage";

const App = () => {
  const { ready, assets } = useLoader();

  // Log State of App
  console.log("Ready ", ready);
  console.log("assets ", assets);

  return (
    <>
      {/* <FeatherCursor/> */}
      {!ready && <AssetLoader />}
      {!ready && <FeatherLoader/>}
      {ready && <LandingPage />}
    </>
  );
};

export default App;
