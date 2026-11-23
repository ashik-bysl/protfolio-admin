import { createBrowserRouter } from "react-router";
import { App } from "./App";
import { Login } from "./auth/Login";
import { Register } from "./auth/Register";
import { RequireAuth } from "./auth/RequireAuth";
import Dashboard from "./pages/Dashboard";
import ExprienceList from "./components/ExprienceList";
// scaffold:imports

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      {
        element: <Dashboard />,
        children: [
          { path: "expriences", element: <ExprienceList /> },
          { path: "*", element: <ExprienceList /> },
        ],
      },
      {
        element: <RequireAuth />,
        children: [
          // scaffold:routes
        ],
      },
    ],
  },
]);
