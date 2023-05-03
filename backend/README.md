# Project Title: Real-time Chat Application

### To use the application, head to https://galactchat.netlify.app/ and register. Welcome to the Galact Chat.


## Index
1. [About](#about)
2. [Demo](#demo)
3. [Technologies](#tech)
4. [Usage](#usage)
    * [Installation](#installation)
    * [In the Webapp](#webapp)
5. [Developer Features](#dev)
6. [Future Improvements](#future)
    * [Frontend](#front)
    * [Backend](#back)
7. [Credits](#credits) 
8. [License](#license)
 

<a name="about"></a>
## About

This is a real-time chat application made using React and Redux as frontend, and Node.js, MongoDB Atlas as backend. Socket.io library is used for real-time data exchange. The project includes an authentication page with registry that in addition to normal register and login info, it has a section to create AI-made pictures for your profile picture using Open AI DallE. Also, files are stored in Cloudinary cloud storage. The chat includes all chat functionality like real-time typing, notifications, messages, image message, emojis, last seen, seen, or delivered notification, and media storage for each chat.


<a name="demo"></a>
## Demo

| Authentication Page  |
|:----------------------|
|<img src="https://drive.google.com/uc?export=view&id=1_9MeqzsRwzAMEfgVG6DYsn7ZKMYtwS0h" width="100%" height="100%"/> |

| Main Chat Desktop View |
|:----------------------|
<img src="https://drive.google.com/uc?export=view&id=1-QtIt1Bsb4WhgOXa9ATvRelik_WMAO0d" width="100%" height="100%"/> |



| Main Chat Mobile View Contacts  | &nbsp;&nbsp;&nbsp; |  Main Chat Mobile View Chat  |
|:--------:|:-------------:|:--------:|
|<img src="https://drive.google.com/uc?export=view&id=1-dIbadCR_qVwcq-nw0t0WhULuGN1t3a5" style="margin-right: 10px" width="500" height="100%"/> | &nbsp;&nbsp;&nbsp; | <img src="https://drive.google.com/uc?export=view&id=1uCXv37W7XtssM-y5RsmXpsv-VnbMzxmR" width="500" height="100%"/> |


<a name="tech"></a>
## Technologies
- React.js
- Redux
- Node.js
- css, HTML, Javascript
- Sass
- MongoDB Atlas
- Axios
- Jason Web Tokens (JWT)
- Socket.io
- Open AI Dall-E
- Cloudinary
- bycrypt
- cors
- cookies


<a name="usage"></a>
### Usage

To use the application, head to https://galactchat.netlify.app/ and register. To use it locally follow the next section.

<a name="installation"></a>
### Installation

To install Galactic Social Network on your local computer, you need to:

1. Clone the repository to your local machine.

   ```
   git clone https://github.com/<username>/real-time-chat-app.git
   ```

2. Navigate to the project directory.

   ```
   cd chat
   ```

3. Navigate to the frontend directory and install the dependencies for both frontend using the following command in terminal:

   ```
   cd frontend/
   npm install
   ```
4. From therre, navigate to the backend directory and install the dependencies for backend using the following command terminal:
 
   ```
   cd ../backend/
   npm install
   ```

4. Navigate to `cd ./config` and create a `config.env` file add the following environment variables:

   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_ATLAS_URL=<your_mongodb_uri>
   SECRET=<your_jwt_secret> #it's your apps JWT secret
   TOKEN_EXP = <arbitrary_token_expiration_days_like_'7d'>
   COOKIE_EXP = <arbitrary_cookie_expiration_days_like_'7'>
   REACT_APP_API_KEY_DALLE=<your_DALL-E_key_from_openai>
   CLOUDINARY_NAME=<your_cloudinary_cloud_name>
   CLOUDINARY_API_KEY=<your_cloudinary_api_key>
   CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
   ```

5. Run the project using the following command in the backend directory in a separate terminal window:

   ```
   npm run dev
   ```

   This will start the frontend and backend servers.


### In the Webapp
<a name="webapp"></a>

Welcome to our Chat App, an easy-to-use platform for real-time messaging with your friends and contacts. Our app offers the following features:

#### User Registration and Profile Management

To get started, simply register an account and create your profile. You can select an image from your local computer or use our AI-driven image generator. Just describe what you're imagining and the AI will create an image for you.

#### Real-Time Messaging

Once you're logged in, you'll see a list of all the people you've previously connected with on the left-hand side of the screen. Simply click on a user to start a conversation with them. The chat interface is located in the middle of the screen, and you can send text messages, upload pictures, or add fun emojis to your messages.

#### Media Sharing

On the right-hand side of the screen, you'll see the profile information for the friend you're chatting with, as well as a media-sharing section that includes all the media files you've sent or received from that specific user.

#### Responsive Design

The app is fully responsive, meaning you can use it on any device. The layout is optimized for both desktop and mobile screens, so you'll always have a great user experience no matter how you access the app.

#### Logout

When you're finished using the app, simply click the "Logout" button on the top left-hand side of the screen to end your session.


<a name="dev"></a>
## Developer Features

- **Scalable State Management with Redux and Redux Thunk:** State management is done efficiently and effectively by using Redux and Redux Thunk libraries. This provides a better architecture and a single source of truth for state. React hooks such as `useRef`, `useEffect`, and `useState` are used to update the state.
- **Secure User Authentication and Authorization:** Users can securely register and log in with their credentials. The authentication middleware and cookies check for previous logins with the help of the `jsonwebtoken` library. The registration process is secured using the `bcrypt`, `jsonwebtoken`, and `validator` libraries.
- **Server Information Displayed Using Toasts:** Users are provided with server information using toasts and toaster components to make the user experience better.
- **AI-Generated Profile Pictures Using OpenAI DallE:** An AI-powered image generator using OpenAI DallE is used to create profile pictures for users who do not want to upload their own picture.
- **Real-Time Chat Functionality with Typing Indicators and Notifications:** Chat functionality is implemented in real-time, complete with typing indicators, notifications, and last seen, seen, or delivered notifications using sockets and the `socket.io` library. React `useEffect` hook is also used for efficient state updates.
- **Sound Notifications and Emoji Support:** Users are notified of new messages with sound notifications, and emojis are supported for more expressive communication.
- **Saving Media with Cloudinary Cloud Storage:** Media files are saved using Cloudinary cloud storage for efficient file storage.
- **Safe Data Storage Using MongoDB Atlas and Mongoose:** Meta data, messages, and users are stored safely in MongoDB Atlas using the Mongoose library.
- **Secure Data Transfer Using Axios and Redux Actions:** Data is securely transferred from the frontend to the backend using the Axios library through Redux actions.
- **UI Icons and Components From Various Libraries:** The app's UI is made more attractive using various icons and components from libraries such as `react-icons`, `react-spinners`, and `moment`.

<a name="future"></a>
## Future Improvements
<a name="front"></a>
### Frontend
There are several ways that user experience could be improved in the future. Here are a few suggestions:

- **Customizable User Profile**: Allow users to edit their profile information and customize their settings according to their preferences.
- **Custom Themes**: Introduce different color themes and dark mode options for the chat app to provide a more personalized experience for the users.
- **GIF and Emoji Support**: Expand the variety of visual messages available by incorporating GIF and more emojis into the chat app.

<a name="back"></a>
### Backend
There are several additional feature that can be added to improved the usage of the app in the future. Here are a few suggestions:
- **Premium Cloud Service for Better Database Efficiency**: The app's database can be improved by using a more premium and paid cloud service provider, which can result in faster and more reliable data storage and retrieval.
- **Adding Friends and Follow Functionality**: Enhance user experience by allowing them to add friends and follow different users on the platform.
- **Improved Message Search**: Add the ability to search through messages in addition to searching usernames to easily find specific information.
- **WebRTC-based Video and Voice Calling**: Enable users to make video and voice calls within the app using WebRTC technology for a more integrated experience.
- **AI Chatbot Integration**: Incorporate an AI-powered chatbot to provide users with automated assistance and support with their queries.
- **Message Deletion Functionality**: Allow users to delete messages for better control over their conversation history.
- **Group Chat Functionality**: Enhance the social aspect of the app by adding group chat functionality, where multiple users can participate in a conversation at the same time.

## Credits

- SAMYAR FARJAM (https://github.com/samyarsworld)

If you'd like to contribute to GalacticChat, please feel free to submit a pull request or open an issue on our [GitHub repository](https://github.com/samyarsworld/galactchat-chat-app-backend). We welcome all contributions and feedback.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). See the `LICENSE` file for details.
