import React from "react";
import { Switch } from "react-router-dom";
import PopupWithForm from "content/PopupWithForm";
import ImagePopup from "../src/components/ImagePopup";
import api from "../src/utils/api";
import { CurrentUserContext } from "host/CurrentUserContext";
import AddPlacePopup from "../src/components/AddPlacePopup";
import ProtectedRoute from "host/ProtectedRoute";

function App() {
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [cards, setCards] = React.useState([]);
  const [isLoggedIn] = React.useState(false);

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((cards) =>
          cards.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    api
      .removeCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit(newCard) {
    api
      .addCard(newCard)
      .then((newCardFull) => {
        setCards([newCardFull, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  return (
    // В компонент App внедрён контекст через CurrentUserContext.Provider
      <div className="page__content">
        <Switch>
          <ProtectedRoute
            exact
            path="/"
            cards={cards}
            onAddPlace={handleAddPlaceClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            loggedIn={isLoggedIn}
          />
        </Switch>
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onAddPlace={handleAddPlaceSubmit}
          onClose={closeAllPopups}
        />
        <PopupWithForm title="Вы уверены?" name="remove-card" buttonText="Да" />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
      </div>
  );
}

export default App;
