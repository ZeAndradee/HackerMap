import { createRoot } from "react-dom/client";
import HomePage from "./pages/HomePage/HomePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const pages = [{ path: "/", element: <HomePage /> }];

const router = createBrowserRouter([
  ...pages,
  { path: "*", element: <p>Essa página não foi encontrada :( Error 404</p> },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
