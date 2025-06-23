import { lazy } from "react";

const Main = lazy(() => import("../layout/Main"));

const LandingPage = lazy(() => import("../pages/LandingPage"));
const SignInPage = lazy(() => import("../pages/SignInPage"));

const Chat = lazy(() => import("../pages/Chat"));
const Offer = lazy(() => import("../pages/Offer"));
const Planner = lazy(() => import("../pages/Planner"));
const Finder = lazy(() => import("../pages/Finder"));


const routes = [
  {
    path: "/",
    element: <Main />,
    children: [
      { path: "", element: <LandingPage /> },
      { path: "/login", element: <SignInPage authMode="login" /> },
      { path: "/signup", element: <SignInPage authMode="signup" /> },
      { path: "/chat", element: <Chat /> },
      { path: "/offer", element: <Offer /> },
      { path: "/planner", element: <Planner /> },
      { path: "/offer", element: <Finder /> },
    ],
  },

  //   { path: "*", element: <NotFoundPage /> },
];

export default routes;
