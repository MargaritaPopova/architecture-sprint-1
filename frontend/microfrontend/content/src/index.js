import("./App");

import "./index.css"; // Подключение локальных стилей

// Импортируем стили из host
import("host/vendor")
  .then(() => {
    console.log("Host styles loaded successfully.");
  })
  .catch((err) => {
    console.error("Failed to load styles from host:", err);
  });
