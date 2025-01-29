import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Router from "./router/router";

function App() {
  return (
    <BrowserRouter>
      {/* <Header />   */}
      <Router />
      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default App;
