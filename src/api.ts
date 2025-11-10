import axios from "axios";

export const clientToNextApi = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_ROUTE_ROOT_URL}/api`,
});

export const clientAPI_V1 = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_DJANGO_BACKEND_ROOT_URL}/api/v1`,
});
