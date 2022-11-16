const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1x9Elszk2DEPrPOL_qgWrvKimQGbu4xE",
  authDomain: "vdoprathameshvn.firebaseapp.com",
  projectId: "vdoprathameshvn",
  storageBucket: "vdoprathameshvn.appspot.com",
  messagingSenderId: "706683806983",
  appId: "1:706683806983:web:0d7c47922604a8e703d1a2",
  measurementId: "G-1MGNNFS3TK"
};

// Initialize Firebase
const vdoapp = initializeApp(firebaseConfig);
const analytics = getAnalytics(vdoapp);




const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('Running');
});

io.on("connection", (socket) => {
	socket.emit("me", socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
