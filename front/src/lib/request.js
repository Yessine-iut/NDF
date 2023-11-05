import axios from 'axios';
const { REACT_APP_API_URL } = "http://localhost:8080/";//process.env

export const request = axios.create({
	baseURL: REACT_APP_API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});