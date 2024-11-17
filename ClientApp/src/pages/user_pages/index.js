import React, { useState, useContext } from "react";
import { Outlet } from "react-router-dom";

import AuthModal from "../../components/user_components/AuthModal";
import Header from "../../components/user_components/header";
import Footer from "../../components/user_components/footer";

function Index() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="user">
      <AuthModal
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
      />

      <Header
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
      />

      <div
        style={{
          flex: 1,
        }}
      >
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}

export default Index;
