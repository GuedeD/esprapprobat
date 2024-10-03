import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./routes/Home";
import FirstLayout from "./components/FirstLayout";
import Boutique from "./routes/Boutique";
import Contact from "./routes/Contact";
import Connexion from "./routes/Connexion";
import MDPOublie from "./routes/MDPOublie";
import EnregistrezVous from "./routes/EnregistrezVous";
import Layout from "./components/Layout";
import DashBoardClient from "./routes/DashBoardClient";
import Commandes from "./routes/Profil/Commandes";
import ListeEnvies from "./routes/Profil/ListeEnvies";
import Addresse from "./routes/Profil/Addresse";
import AMAdresse from "./routes/Profil/AMAdresse";
import CommandesLivrees from "./routes/Profil/CommandesLivrees";
import ModifierNumero from "./routes/Profil/ModifierNumero";
import AdminLayout from "./components/AdminLayout";
import VoirProduits from "./routes/Admin/VoirProduits";
import VoirCommandes from "./routes/Admin/VoirCommandes";
import ModifierProduit from "./routes/Admin/ModifierProduit";
import AjouterProduit from "./routes/Admin/AjouterProduit";
import TableauDeBord from "./routes/Admin/TableauDeBord";
import Produit from "./routes/Produit";
import Cart from "./routes/Cart";
import Checkout from "./routes/Checkout";
import Coupons from "./routes/Admin/Coupons";
import Search from "./routes/Search";
import { recupererProduitClient } from "./utils/hooks";
import Utilisateurs from "./routes/Admin/Utilisateurs";
import Custom from "./routes/Admin/Custom";
import Proforma from "./routes/Admin/Proforma";
import ProtectedRoute from "./routes/Admin/ProtectedRoute";
import ErrorPage from "./components/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <FirstLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "boutique",
        element: <Boutique />,
      },
      {
        path: "produit/:slug",
        element: <Produit />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "connexion",
        element: <Connexion />,
      },
      {
        path: "search",
        element: <Search />,
        loader: recupererProduitClient,
      },
      {
        path: "enregistrer",
        element: <EnregistrezVous />,
      },
      {
        path: "mdpoublie",
        element: <MDPOublie />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "profil",
        element: <Layout />,
        children: [
          {
            path: "",
            element: <DashBoardClient />,
          },
          {
            path: "commandes",
            element: <Commandes />,
          },
          {
            path: "commandes/okay",
            element: <CommandesLivrees />,
          },
          {
            path: "envies",
            element: <ListeEnvies />,
          },
          {
            path: "modifierNumero",
            element: <ModifierNumero />,
          },
          {
            path: "adresse",
            element: <Addresse />,
          },
          {
            path: "adresse/creer",
            element: <AMAdresse />,
          },
        ],
      },
    ],
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute adminRequired={true}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <TableauDeBord />,
      },
      {
        path: "produits",
        element: <VoirProduits />,
      },
      {
        path: "ajouter",
        element: <AjouterProduit />,
      },
      {
        path: "commandes",
        element: <VoirCommandes />,
      },
      {
        path: "utilisateurs",
        element: <Utilisateurs />,
      },
      {
        path: "proforma",
        element: <Proforma />,
      },
      {
        path: "personnaliser",
        element: <Custom />,
      },
      {
        path: "coupons",
        element: <Coupons />,
      },
      {
        path: "modifier/:id",
        element: <ModifierProduit />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
