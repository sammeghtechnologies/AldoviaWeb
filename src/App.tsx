import AssetLoader from "./AssetLoader";
import FeatherLoader from "./components/FeatherLoader";
import { useLoader } from "./context/LoaderProvider";
//import LandingPage from "./LandingPage";
import TestLandingPage from "./testlandingpage";

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
      {ready && <TestLandingPage />}
    </>
  );
};

export default App;
