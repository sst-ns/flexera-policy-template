import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layouts/Layout";
import Loading from "./components/Loading";

const router = createBrowserRouter([
  {
    path: "",
    element: (
      <Suspense fallback={<Loading />}>
        <Layout />
      </Suspense>
    ),
    children: [
      {
        path: "/",
        async lazy() {
          let { default: PolicyGenerator } = await import(
            "./pages/policy-generator/PolicyGenerator"
          );
          return { Component: PolicyGenerator };
        },
      },
      {
        path: "/user-management",
        async lazy() {
          let { default: UserManagement } = await import(
            "./pages/UserManagement"
          );
          return { Component: UserManagement };
        },
      },
    ],
  },

  {
    path: "*",
    async lazy() {
      let { default: NotExist } = await import("./pages/NotExist");
      return { Component: NotExist };
    },
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
