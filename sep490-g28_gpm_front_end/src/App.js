import './App.css';
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Helmet } from 'react-helmet';
import HomeImage from './assets/images/sucmanh2000.png'
import { BASE_URL_FE } from './config';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <div className="App">
        {/* <Helmet>
        <link rel="canonical" href={BASE_URL_FE} />
        <meta name="description" content="Tổ chức thiện nguyện vì cộng đồng." />
        <meta name="keywords" content="sucmanh2000, gople, thiennguyen" />
        <meta property="og:image" content={HomeImage} />
      </Helmet> */}

        <AppRoutes />
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          pauseOnHover
        />
      </div>
    </HelmetProvider>

  );
}

export default App;