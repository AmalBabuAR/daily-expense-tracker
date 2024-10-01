import { AuthProvider } from "./context/authContext";
import { useRoutes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignIn from "./pages/SignIn";
import { SortProvider } from "./context/sortBtnContext";
import { WalletProvider } from "./context/walletContext";
import { IncomeAndExpenseProvider } from "./context/incomeAndExpenseContext";

function App() {
  const routesArray = [
    {
      path: "/",
      element: (
        <SortProvider>
          <IncomeAndExpenseProvider>
            <WalletProvider>
              <Home />
            </WalletProvider>
          </IncomeAndExpenseProvider>
        </SortProvider>
      ),
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <SignIn />,
    },
  ];
  let routesElement = useRoutes(routesArray);
  return <AuthProvider>{routesElement}</AuthProvider>;
}

export default App;
