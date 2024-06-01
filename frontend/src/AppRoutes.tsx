import { DestinationDetailsPage } from "./pages/destinations/DestinationDetailsPage";
import { DestinationsPage } from "./pages/destinations/DestinationsPage";
import { HomePage } from "./pages/home/HomePage";
import { TripsPage } from "./pages/trips/TripsPage";
import {
  Route,
  RouteProps,
  Routes,
} from "react-router-dom";

export type RouteConfig = RouteProps & {
  /**
   * Required route path.   * E.g. /home   */
  path: string;
  /**
   * Specify a private route if the route
   should only be accessible for authenticated users   */
  isPrivate?: boolean;
};
export const routes: RouteConfig[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/trips",
    element: <TripsPage />,
  },
  {
    path: "/destinations",
    element: <DestinationsPage />,
  },
  {
    path: "/destinations/:id",
    element: <DestinationDetailsPage />,
  },
];

const renderRouteMap = (route: RouteConfig) => {
  const { isPrivate, element, ...rest } = route;
  return <Route key={route.path} element={element} {...rest} />;
};
export const AppRoutes = () => {
  return <Routes>{routes.map(renderRouteMap)}</Routes>;
};
