import { type AppType } from "next/dist/shared/lib/utils";

import "~/styles/globals.css";
import { EdgeStoreProvider } from '../lib/edgestore';


const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <EdgeStoreProvider>
      <Component {...pageProps} />
    </EdgeStoreProvider>
  );

};

export default MyApp;
