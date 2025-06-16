import Layout from "../components/Layout";
import HomePage from "../pages/HomePage";
import MusicPage from "../pages/MusicPage";
import FactsPage from "../pages/FactsPage";
import WheelOfFortunePage from "../pages/WheelOfFortunePage"

export const layoutChildren = [
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "home",
        element: <HomePage />,
    },
    {
        path: "wheel-of-fortune",
        element: <WheelOfFortunePage />,
    },
    {
        path: "facts",
        element: <FactsPage />,
    },
    {
        path: "music",
        element: <MusicPage />
    }
];

const routes = [
    {
        path: "/",
        element: <Layout />,
        children: layoutChildren
    }
]

export default routes;