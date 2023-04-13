import Login from "../pages/Login";
import Home from "../pages/Home";
import {LOGIN, HOME, DETAIL_PIN, CREATE_PIN, USER_PROFILE, CATEGORY, SEARCH} from "./path";
import Feed from "../component/Feed";
import DetailPin from "../component/DetailPin";
import CreatePin from "../component/CreatePin";
import UserProfile from "../component/UserProfile";

interface IRoute {
  path: string;
  Component: React.FC;
}

export const publicRoutes: IRoute[] = [
  {
    path: HOME + "*",
    Component: Home
  },
  {
    path: LOGIN,
    Component: Login
  },

];

export const homePageRoutesPublic: IRoute[] = [
  {
    path: HOME,
    Component: Feed
  },
  {
    path: CATEGORY + "/:categoryId",
    Component: Feed
  },
  {
    path: DETAIL_PIN + "/:pinId",
    Component: DetailPin
  },
  {
    path: USER_PROFILE + "/:userId",
    Component: UserProfile
  }
]

export const homePageRoutesPrivate: IRoute[] = [
  {
    path: CREATE_PIN,
    Component: CreatePin
  },
]