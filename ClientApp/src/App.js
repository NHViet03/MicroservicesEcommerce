import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { postDataAPI } from "./utils/fetchDataAccount";
import { getDataAPI } from "./utils/fetchData";
import Alert from "./components/Alert";

// Import User Page
import UserCommonPage from "./pages/user_pages/index";
import UserHomePage from "./pages/user_pages/home";
import UserProductPage from "./pages/user_pages/product";
import UserProductDetailPage from "./pages/user_pages/product/[id]";
import UserCart from "./pages/user_pages/cart";
import UserProceed from "./pages/user_pages/proceed";
import UserContact from "./pages/user_pages/contact";
import UserOrderPage from "./pages/user_pages/order";
import UserOrderDetailPage from "./pages/user_pages/order/[id]";

// Page not found
import PageNotFound from "./components/NotFound";

export const AppContext = createContext(null);

function App() {
  const [alert, setAlert] = useState(false);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");

    if (firstLogin && auth === false) {
      postDataAPI(`api/refresh_token`)
        .then((res) => {
          setAuth({
            ...res.data.data,
            token: res.data.access_token,
          });
        })
        .catch((err) => {
          console.log(err);
          setAlert({
            title: "Error",
            data: err.response.data.msg,
            type: "error",
          });
        });
    } else {
      setAuth(false);
    }
  }, []);

  useEffect(() => {
    if (!auth || !auth.CustomerId) return;

    getDataAPI(`customer/user/getAllCartAuth/${auth.CustomerId}`)
      .then((res) => {
        setAuth({
          ...auth,
          cart: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [auth]);

  return (
    <AppContext.Provider value={{ alert, setAlert, auth, setAuth }}>
      <BrowserRouter>
        <div className="App">
          <Alert />
          <div className="main">
            <Routes>
              {/* User Pages */}
              <Route path="/" element={<UserCommonPage />}>
                <Route index element={<UserHomePage />} />
                <Route path="product" element={<UserProductPage />} />
                <Route path="product/:id" element={<UserProductDetailPage />} />
                <Route path="cart" element={<UserCart />} />
                <Route path="proceed" element={<UserProceed />} />
                <Route path="contact" element={<UserContact />} />
                <Route path="order" element={<UserOrderPage />} />
                <Route path="order/:id" element={<UserOrderDetailPage />} />
              </Route>

              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
