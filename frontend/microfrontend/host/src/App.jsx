import React, { lazy }  from "react";
import ReactDOM from "react-dom/client";

import "./index.css";


const UsersControl = lazy(() => import('users/UsersControl').catch(() => {
 return { default: () => <div className='error'>Component is not available!</div> };
})
);

const CardsControl = lazy(() => import('cards/CardsControl').catch(() => {
return { default: () => <div className='error'>Component is not available!</div> };
})
);

const ContentControl = lazy(() => import('content/ContentControl').catch(() => {
return { default: () => <div className='error'>Component is not available!</div> };
})
);

const App = () => (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page__content">
        <Switch>
          <ProtectedRoute
            exact
            path="/"
            component={Main}
            loggedIn={isLoggedIn}
          />
        </Switch>
        <UsersControl></UsersControl>
        <CardsControl></CardsControl>
        <ContentControl></ContentControl>
      </div>
    </CurrentUserContext.Provider>
);

const rootElement = document.getElementById("app")
if (!rootElement) throw new Error("Failed to find the root element")

const root = ReactDOM.createRoot(rootElement)

root.render(<App />)