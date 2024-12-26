# Задание 1

## Примечание

В первом задании выполнено условное разделение на директории и разброс кода по файлам, привязанный к "скелету" приложения на `ModuleFederation`, созданного с помощью стандартной команды `npx create-mf-app`

## Выбор фреймворка

Для разделения этого проекта на микрофронтенды был выбран фреймворк `Webpack Module Federation`. 
При выборе между ним и SingleSPA я ориентировалась на то, что SingleSPA делает упор на бесшовной интеграции и разнообразии фреймворков, в нашем же случае фреймворк один - React. В то же время Webpack Module Federation позволяет микрофронтендам динамически обмениваться зависимостями во время выполнения, что как раз пригодится в рассматриваемом проекте. 
  

## Структура проекта

Было выделено четыре микрофронтенда:
- `host` - основное приложение, которое управляет микрофронтендами и хранит общие ресурсы - статику, компоненты, стили
- `cards` - микрофронтенд для управления основным продуктом - карточками мест
- `users` - микрофронтенд для управления пользователями (авторизация, профили)
- `content` - микрофронтенд для управления остальным контентом страницы - хедер, футер, тултипы, попапы.
Примечательно, что в структуре бэкенда тоже выделены блоки users и cards, а значит, при необходимости будет легче выделить их в паттерне Backend for Frontend, если такой будет применяться. 

Компоненты монолита были распределены по микрофронтендам таким образом:
<details>
  <summary>Развернуть</summary>

```
├── README.md
├── compose.yaml
├── docker-bake.hcl
├── microfrontend
│   ├── cards
│   │   ├── Dockerfile.frontend
│   │   ├── compilation.config.js
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── App.jsx
│   │   │   ├── blocks
│   │   │   │   ├── card
│   │   │   │   └── places
│   │   │   ├── components
│   │   │   │   ├── AddPlacePopup.js
│   │   │   │   ├── Card.js
│   │   │   │   ├── CardsControl.js
│   │   │   │   └── ImagePopup.js
│   │   │   ├── index.css
│   │   │   ├── index.html
│   │   │   ├── index.js
│   │   │   └── utils
│   │   │   │   └── api.js
│   │   └── webpack.config.js
│   ├── content
│   │   ├── Dockerfile.frontend
│   │   ├── compilation.config.js
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── App.jsx
│   │   │   ├── blocks
│   │   │   │   ├── content
│   │   │   │   ├── footer
│   │   │   │   ├── header
│   │   │   │   ├── page
│   │   │   │   └── popup
│   │   │   ├── components
│   │   │   │   ├── ContentControl.js
│   │   │   │   ├── Footer.js
│   │   │   │   ├── Header.js
│   │   │   │   ├── InfoTooltip.js
│   │   │   │   └── PopupWithForm.js
│   │   │   ├── index.css
│   │   │   ├── index.html
│   │   │   └── index.js
│   │   └── webpack.config.js
│   ├── host
│   │   ├── Dockerfile.frontend
│   │   ├── compilation.config.js
│   │   ├── index.spec.js
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── public
│   │   │   ├── favicon.ico
│   │   │   ├── index.html
│   │   │   ├── logo192.png
│   │   │   ├── logo512.png
│   │   │   ├── manifest.json
│   │   │   └── robots.txt
│   │   ├── src
│   │   │   ├── App.jsx
│   │   │   ├── components
│   │   │   │   ├── App.js
│   │   │   │   ├── Main.js
│   │   │   │   └── ProtectedRoute.js
│   │   │   ├── contexts
│   │   │   │   └── CurrentUserContext.js
│   │   │   ├── images
│   │   │   ├── index.css
│   │   │   ├── index.html
│   │   │   ├── index.js
│   │   │   ├── logo.svg
│   │   │   ├── serviceWorker.js
│   │   │   ├── setupTests.js
│   │   │   └── vendor
│   │   └── webpack.config.js
│   └── users
│   │   ├── Dockerfile.frontend
│   │   ├── compilation.config.js
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── App.jsx
│   │   │   ├── blocks
│   │   │   │   ├── auth-form
│   │   │   │   ├── login
│   │   │   │   └── profile
│   │   │   ├── components
│   │   │   │   ├── EditAvatarPopup.js
│   │   │   │   ├── EditProfilePopup.js
│   │   │   │   ├── Login.js
│   │   │   │   ├── Register.js
│   │   │   │   └── UsersControl.js
│   │   │   ├── images
│   │   │   │   ├── add-icon.svg
│   │   │   │   └── edit-icon.svg
│   │   │   ├── index.css
│   │   │   ├── index.html
│   │   │   ├── index.js
│   │   │   └── utils
│   │   │   │   ├── api.js
│   │   │   │   └── auth.js
│   │   └── webpack.config.js
├── package-lock.json
├── package.json

```
</details>

Каждый из микрофронтендов содержит свой `Dockerfile`, общая сборка происходит с помощью `docker compose` из файла `compose.yaml` в главной директории.

В приложении `host` находятся ресурсы, общие для разных микрофронтендов: компонент `ProtectedRoute`, контекст `CurrentUserContext`, статика `images`, папка `vendor`, главный файл стилей `index.css`.
В `webpack.config.js` этого приложения нужные ресурсы выставлены наружу с помощью настройки `exposes`.

К микрофронтенду cards отнесены компоненты `AddPlacePopup`, `Card`, `ImagePopup`, `api` для взаимодействия с бэкендом `cards` и стили `blocks/card` и `blocks/places`.

В `users` вынесены компоненты `EditAvatarPopup`, `EditProfilePopup`, `Login`, `Register`, API `auth` и `api` для взаимодействия с бэкендом `users`. 

Приложение content содержит компоненты `Footer`, `Header`, `InfoTooltip`, `PopupWithForm`, стили для `content`, `footer`, `header`, `page`, `popup`.

У главного микрофронтенда `host` есть доступ ко всем остальным (благодаря их настройкам `exposes`), и в основной своей точке доступа `App.jsx` он собирает общее приложение

# Задание 2

Ссылка на схему архитектуры: https://drive.google.com/file/d/1XAbatwkj_6iklPWhIKMllrqbKYaciwYq/view?usp=sharing
если первая ссылка не открылась, вот еще одна: https://app.diagrams.net/#G1XAbatwkj_6iklPWhIKMllrqbKYaciwYq#%7B%22pageId%22%3A%22BleSmaJVXqo2yb7Co1eL%22%7D