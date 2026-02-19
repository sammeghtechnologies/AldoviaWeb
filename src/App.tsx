import AssetLoader from "./AssetLoader";
import { useLoader } from "./context/LoaderProvider";
import LandingPage from "./LandingPage";

const App = () => {
  const { ready, assets } = useLoader();

  // Log State of App
  console.log("Ready ", ready);
  console.log("assets ", assets);

  return (
    <>
      {!ready && <AssetLoader />}
      {!ready && <div className="loader">Loading…</div>}
      {ready && <LandingPage />}
    </>
  );
};

export default App;
