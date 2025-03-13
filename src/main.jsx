import { createRoot } from "react-dom/client";
import HomePage from "./pages/HomePage/HomePage";
import LocationTrackingPage from "./pages/LocationTrackingPage/LocationTrackingPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

const pages = [
  { path: "/", element: <HomePage /> },
  { path: "/track", element: <LocationTrackingPage /> },
];

const router = createBrowserRouter([
  ...pages,
  { path: "*", element: <p>Essa página não foi encontrada :( Error 404</p> },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
