export const API_BASE = '/api/v1';

async function request<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T> {
	const res = await fetch(
		`${API_BASE}${endpoint}`,
		{
			credentials: 'include', // Include cookies for authentication
			headers: {
				...(options.body instanceof FormData
					? {}
					: {
							'Content-Type': 'application/json',
						}),
			},
			...options,
		}
	);

	if (!res.ok) {
		let errorMessage = 'API Error';
		try {
			const error = await res.json();
			errorMessage = error.error || errorMessage;
		} catch {
			// If response is not JSON, use status text or default message
			errorMessage = res.statusText || `HTTP ${res.status} Error`;
		}
		throw new Error(errorMessage);
	}
	return res.json();
}

export const api = {
	homepage: {
		comingSoon: (limit = 6) =>
			request<{
				data: any[];
				total: number;
			}>(`/meals/coming-soon?limit=${limit}`, {
				method: 'GET',
			}),
		newlyArrivals: (limit = 6) =>
			request<{
				data: any[];
				total: number;
			}>(`/meals/newly-arrivals?limit=${limit}`, {
				method: 'GET',
			}),
		bestSellers: (limit = 6) =>
			request<{
				data: any[];
				total: number;
			}>(`/meals/best-sellers?limit=${limit}`, {
				method: 'GET',
			}),
	},
	events: {
		list: (page = 1, limit = 10, search?: string) => {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
			});
			if (search) {
				params.append('search', search);
			}
			return request<{
				data: any[];
				total: number;
				totalPages: number;
				page: number;
			}>(`/events?${params.toString()}`, {
				method: 'GET',
			});
		},
		get: (id: string) =>
			request<any>(`/events/${id}`, {
				method: 'GET',
			}),
		create: (data: any) =>
			request<any>('/events', {
				method: 'POST',
				body: JSON.stringify(data),
			}),
		update: (id: string, data: any) =>
			request<any>(`/events/${id}`, {
				method: 'PUT',
				body: JSON.stringify(data),
			}),
		delete: (id: string) =>
			request<any>(`/events/${id}`, {
				method: 'DELETE',
			}),
	},
	services: {
		list: (page = 1, limit = 10, search?: string, categoryId?: string) => {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
			});
			if (search) {
				params.append('search', search);
			}
			if (categoryId) {
				params.append('categoryId', categoryId);
			}
			return request<{
				data: any[];
				total: number;
				totalPages: number;
				page: number;
			}>(`/services?${params.toString()}`, {
				method: 'GET',
			});
		},
		get: (id: string) =>
			request<any>(`/services/${id}`, {
				method: 'GET',
			}),
		create: (data: any) =>
			request<any>('/services', {
				method: 'POST',
				body: JSON.stringify(data),
			}),
		update: (id: string, data: any) =>
			request<any>(`/services/${id}`, {
				method: 'PUT',
				body: JSON.stringify(data),
			}),
		delete: (id: string) =>
			request<any>(`/services/${id}`, {
				method: 'DELETE',
			}),
	},
	serviceCategories: {
		list: (page = 1, limit = 100) => {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
			});
			return request<{
				data: any[];
				total: number;
				totalPages: number;
				page: number;
			}>(`/service-categories?${params.toString()}`, {
				method: 'GET',
			});
		},
		get: (id: string) =>
			request<any>(`/service-categories/${id}`, {
				method: 'GET',
			}),
		create: (data: any) =>
			request<any>('/service-categories', {
				method: 'POST',
				body: JSON.stringify(data),
			}),
		update: (id: string, data: any) =>
			request<any>(`/service-categories/${id}`, {
				method: 'PUT',
				body: JSON.stringify(data),
			}),
		delete: (id: string) =>
			request<any>(`/service-categories/${id}`, {
				method: 'DELETE',
			}),
	},
	products: {
		list: (page = 1, limit = 10, search?: string, categoryId?: string) => {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
			});
			if (search) {
				params.append('search', search);
			}
			if (categoryId) {
				params.append('categoryId', categoryId);
			}
			return request<{
				data: any[];
				total: number;
				totalPages: number;
				page: number;
			}>(`/products?${params.toString()}`, {
				method: 'GET',
			});
		},
		get: (id: string) =>
			request<any>(`/products/${id}`, {
				method: 'GET',
			}),
		create: (data: any) =>
			request<any>('/products', {
				method: 'POST',
				body: JSON.stringify(data),
			}),
		update: (id: string, data: any) =>
			request<any>(`/products/${id}`, {
				method: 'PUT',
				body: JSON.stringify(data),
			}),
		delete: (id: string) =>
			request<any>(`/products/${id}`, {
				method: 'DELETE',
			}),
	},
	productCategories: {
		list: (page = 1, limit = 100) => {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
			});
			return request<{
				data: any[];
				total: number;
				totalPages: number;
				page: number;
			}>(`/product-categories?${params.toString()}`, {
				method: 'GET',
			});
		},
		get: (id: string) =>
			request<any>(`/product-categories/${id}`, {
				method: 'GET',
			}),
		create: (data: any) =>
			request<any>('/product-categories', {
				method: 'POST',
				body: JSON.stringify(data),
			}),
		update: (id: string, data: any) =>
			request<any>(`/product-categories/${id}`, {
				method: 'PUT',
				body: JSON.stringify(data),
			}),
		delete: (id: string) =>
			request<any>(`/product-categories/${id}`, {
				method: 'DELETE',
			}),
	},
	lifeCareer: {
		get: () =>
			request<any>('/life-career', {
				method: 'GET',
			}),
		create: (data: any) =>
			request<any>('/life-career', {
				method: 'POST',
				body: JSON.stringify(data),
			}),
		update: (id: string, data: any) =>
			request<any>(`/life-career/${id}`, {
				method: 'PUT',
				body: JSON.stringify(data),
			}),
	},
	employees: {
		list: (page = 1, limit = 100, search?: string) => {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
			});
			if (search) {
				params.append('search', search);
			}
			return request<{
				data: any[];
				total: number;
				totalPages: number;
				page: number;
			}>(`/employees?${params.toString()}`, {
				method: 'GET',
			});
		},
		get: (id: string) =>
			request<any>(`/employees/${id}`, {
				method: 'GET',
			}),
		create: (data: any) =>
			request<any>('/employees', {
				method: 'POST',
				body: JSON.stringify(data),
			}),
		update: (id: string, data: any) =>
			request<any>(`/employees/${id}`, {
				method: 'PUT',
				body: JSON.stringify(data),
			}),
		delete: (id: string) =>
			request<any>(`/employees/${id}`, {
				method: 'DELETE',
			}),
	},
	jobApplications: {
		list: (page = 1, limit = 10, search?: string, status?: string) => {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
			});
			if (search) {
				params.append('search', search);
			}
			if (status) {
				params.append('status', status);
			}
			return request<{
				data: any[];
				total: number;
				totalPages: number;
				page: number;
			}>(`/job-applications?${params.toString()}`, {
				method: 'GET',
			});
		},
		get: (id: string) =>
			request<any>(`/job-applications/${id}`, {
				method: 'GET',
			}),
		update: (id: string, data: any) =>
			request<any>(`/job-applications/${id}`, {
				method: 'PUT',
				body: JSON.stringify(data),
			}),
		delete: (id: string) =>
			request<any>(`/job-applications/${id}`, {
				method: 'DELETE',
			}),
	},
	jobPostings: {
		list: (page = 1, limit = 10, search?: string, departmentId?: string, isActive?: boolean) => {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
			});
			if (search) {
				params.append('search', search);
			}
			if (departmentId) {
				params.append('departmentId', departmentId);
			}
			if (isActive !== undefined) {
				params.append('isActive', isActive.toString());
			}
			return request<{
				data: any[];
				total: number;
				totalPages: number;
				page: number;
			}>(`/job-postings?${params.toString()}`, {
				method: 'GET',
			});
		},
		get: (id: string) =>
			request<any>(`/job-postings/${id}`, {
				method: 'GET',
			}),
		create: (data: any) =>
			request<any>('/job-postings', {
				method: 'POST',
				body: JSON.stringify(data),
			}),
		update: (id: string, data: any) =>
			request<any>(`/job-postings/${id}`, {
				method: 'PUT',
				body: JSON.stringify(data),
			}),
		delete: (id: string) =>
			request<any>(`/job-postings/${id}`, {
				method: 'DELETE',
			}),
	},
	departments: {
		list: (page = 1, limit = 100) => {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
			});
			return request<{
				data: any[];
				total: number;
				totalPages: number;
				page: number;
			}>(`/departments?${params.toString()}`, {
				method: 'GET',
			});
		},
		get: (id: string) =>
			request<any>(`/departments/${id}`, {
				method: 'GET',
			}),
		create: (data: any) =>
			request<any>('/departments', {
				method: 'POST',
				body: JSON.stringify(data),
			}),
		update: (id: string, data: any) =>
			request<any>(`/departments/${id}`, {
				method: 'PUT',
				body: JSON.stringify(data),
			}),
		delete: (id: string) =>
			request<any>(`/departments/${id}`, {
				method: 'DELETE',
			}),
	},
};