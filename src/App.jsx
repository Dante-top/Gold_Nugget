import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import Home from "./component/Home/index";

function App() {
	return (
		<>
			<ToastContainer
				position="top-center"
				autoClose={3000}
				hideProgressBar
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			<Router>
				<Routes>
					<Route exact path="/" element={<Home />} />
					<Route element={() => <h2>404 Not Found</h2>} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
