import { BrowserRouter, Route, Routes } from "react-router-dom";
import Calc from "./calc";

export default function AppRoutes() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Calc />} />
      </Routes>
    </BrowserRouter>
  )

}