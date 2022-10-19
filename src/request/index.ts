import axios from "axios";

//全局配置
// axios.defaults.baseURL = "http://162.14.117.124:50000/api";
axios.defaults.baseURL = "http://localhost:50000/api";
axios.defaults.timeout = 10000;

// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';

//拦截器
axios.interceptors.request.use(
	(config) => {
		let tokenName = localStorage.getItem("tokenName");
		let tokenValue = localStorage.getItem("tokenValue");

		if (tokenName && tokenValue) {
			config.headers.common[tokenName] = tokenValue;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);
axios.interceptors.response.use(
	(response) => {
		return response.data;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default function request(
	url = "",
	params = {},
	type = "POST",
	responseType = "json"
) {
	//设置 url params type 的默认值
	return new Promise((resolve, reject) => {
		let promise;
		if (type.toUpperCase() === "GET") {
			promise = axios({
				url,
				responseType,
			});
		} else {
			promise = axios({
				method: type.toUpperCase(),
				url,
				responseType,
				data: params,
			});
		}
		//处理返回
		promise
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				reject(err);
			});
	});
}

export const uploadFileRequest = (
	url: string,
	data: any,
	method: string = "POST"
) => {
	return axios({
		method,
		url: url,
		data: data,
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};
