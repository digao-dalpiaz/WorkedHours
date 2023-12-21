import { BrowserRouter, Route, Routes } from "react-router-dom";
import Calc from "./calc";

export default function AppRoutes() {

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<Calc />} />
      </Routes>
    </BrowserRouter>
  )

}