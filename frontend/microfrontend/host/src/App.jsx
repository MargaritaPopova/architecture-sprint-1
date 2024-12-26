import React, { lazy, createContext, useState } from "react";
import ReactDOM from "react-dom/client";
import { Route, Switch } from "react-router-dom";

const CurrentUserContext = createContext();

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const UsersControl = lazy(() =>
    import("users/UsersControl").catch(() => ({
      default: () => <div className="error">Users are not available!</div>,
    }))
  );

  const CardsControl = lazy(() =>
    import("cards/CardsControl").catch(() => ({
      default: () => <div className="error">Cards are not available!</div>,
    }))
  );

  const ContentControl = lazy(() =>
    import("content/ContentControl").catch(() => ({
      default: () => <div className="error">Content is not available!</div>,
    }))
  );

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser, isLoggedIn, setIsLoggedIn }}>
      <div className="page__content">
        <UsersControl />
        <CardsControl />
        <ContentControl />
          <Switch>
            <Route path="/users" component={UsersControl} />
            <Route path="/cards" component={CardsControl} />
            <Route path="/content" component={ContentControl} />
        </Switch>
      </div>
    </CurrentUserContext.Provider>

  );
};

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
