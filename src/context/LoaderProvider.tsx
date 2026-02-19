// LoaderContext.tsx
import { createContext, useContext, useState } from "react";

// const LoaderContext = createContext<any>(null);

// export const useLoader = () => useContext(LoaderContext);

type LoaderContextType = {
  ready: boolean;
  setReady: (v: boolean) => void;
  assets: any;
  setAssets: (v: any) => void;
};

const LoaderContext = createContext<LoaderContextType | null>(null);

export const useLoader = () => {
  const ctx = useContext(LoaderContext);
  if (!ctx) throw new Error("useLoader must be used inside LoaderProvider");
  return ctx;
};

export const LoaderProvider = ({ children }: any) => {
  const [ready, setReady] = useState(false);
  const [assets, setAssets] = useState<any>({});

  return (
    <LoaderContext.Provider value={{ ready, setReady, assets, setAssets }}>
      {children}
    </LoaderContext.Provider>
  );
};
