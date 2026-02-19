import { useGSAP } from "@gsap/react";
import App from "./App";
import { LoaderProvider } from "./context/LoaderProvider";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

const ProjectRoot = () => {
    return (
        <LoaderProvider>
            <App />
        </LoaderProvider>
    );
};

export default ProjectRoot;
