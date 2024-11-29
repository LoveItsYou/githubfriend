import { RouterProvider, createBrowserRouter } from "react-router-dom";

// Layout
import { RootLayout } from "./layout/layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
