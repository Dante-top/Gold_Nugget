import { toast } from "react-toastify";

export const ToastErrMsg = (msg) => {
	toast.error(msg, {
		position: "top-center",
		autoClose: 2000,
		hideProgressBar: true,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: 0,
	});
};

export const ToastSuccessMsg = (msg) => {
	toast.success(msg, {
		position: "top-center",
		autoClose: 2000,
		hideProgressBar: true,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: 0,
	});
};

export const ToastWarnMsg = (msg) => {
	toast.warn(msg, {
		position: "top-center",
		autoClose: 3000,
		hideProgressBar: true,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: 0,
	});
};
