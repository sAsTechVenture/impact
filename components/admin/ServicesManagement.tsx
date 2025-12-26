'use client';
import React, { useState, useEffect } from 'react';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import { colors } from '@/config/theme';
import {
	Briefcase,
	Plus,
	Edit,
	Trash2,
	Search,
	X,
	Save,
	Folder,
} from 'lucide-react';
import { api } from '@/utils/api';

interface ServiceCategory {
	id: string;
	name: string;
	description?: string;
	createdAt?: string;
	slug?: string;
}

interface Service {
	id: string;
	name: string;
	slug?: string;
	description: string;
	categoryId: string;
	category?: ServiceCategory;
	price?: number;
	status?: 'active' | 'inactive';
	isActive?: boolean;
	imageUrl?: string;
	bookUrl?: string;
	serviceType?: string;
	duration?: string;
	currency?: string;
	createdAt?: string;
	updatedAt?: string;
}

export const ServicesManagement: React.FC = () => {
	const [services, setServices] = useState<Service[]>([]);
	const [categories, setCategories] = useState<ServiceCategory[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState<string>('all');
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);
	const ITEMS_PER_PAGE = 5;
	const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
	const [editingService, setEditingService] = useState<Service | null>(null);
	const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
	const [serviceFormData, setServiceFormData] = useState<Partial<Service>>({
		name: '',
		description: '',
		categoryId: '',
		price: 0,
		status: 'active',
		serviceType: 'standard',
		currency: 'INR',
		bookUrl: '',
	});
	const [categoryFormData, setCategoryFormData] = useState<Partial<ServiceCategory>>({
		name: '',
		description: '',
	});

	useEffect(() => {
		fetchData();
	}, [currentPage, searchTerm, selectedCategory]);

	// Reset to page 1 when search term or category changes
	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm, selectedCategory]);

	const fetchData = async () => {
		try {
			setLoading(true);
			const [servicesRes, categoriesRes] = await Promise.all([
				api.services.list(currentPage, ITEMS_PER_PAGE, searchTerm, selectedCategory !== 'all' ? selectedCategory : undefined),
				api.serviceCategories.list(1, 100),
			]);
			setServices(servicesRes.data || []);
			setCategories(categoriesRes.data || []);
			setTotalPages(servicesRes.totalPages || 1);
			setTotal(servicesRes.total || 0);
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleServiceSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			// Prepare data for API - ensure slug is generated if not provided
			const serviceData = {
				...serviceFormData,
				slug: editingService?.slug || generateSlug(serviceFormData.name || ''),
			};
			
			if (editingService) {
				await api.services.update(editingService.id, serviceData);
			} else {
				await api.services.create(serviceData);
			}
			resetServiceForm();
			fetchData();
		} catch (error) {
			console.error('Error saving service:', error);
			alert('Failed to save service. Please try again.');
		}
	};

	// Generate slug from name
	const generateSlug = (name: string): string => {
		return name
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, '')
			.replace(/[\s_-]+/g, '-')
			.replace(/^-+|-+$/g, '');
	};

	const handleCategorySubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const categoryData = {
				...categoryFormData,
				slug: editingCategory?.slug || generateSlug(categoryFormData.name || ''),
			};
			if (editingCategory) {
				await api.serviceCategories.update(editingCategory.id, categoryData);
			} else {
				await api.serviceCategories.create(categoryData);
			}
			resetCategoryForm();
			fetchData();
		} catch (error) {
			console.error('Error saving category:', error);
			alert('Failed to save category. Please try again.');
		}
	};

	const handleServiceDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this service?')) return;
		try {
			await api.services.delete(id);
			fetchData();
		} catch (error) {
			console.error('Error deleting service:', error);
			alert('Failed to delete service. Please try again.');
		}
	};

	const handleCategoryDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this category? All services in this category will be affected.')) return;
		try {
			await api.serviceCategories.delete(id);
			fetchData();
		} catch (error) {
			console.error('Error deleting category:', error);
			alert('Failed to delete category. Please try again.');
		}
	};

	const handleServiceEdit = (service: Service) => {
		setEditingService(service);
		setServiceFormData({
			name: service.name,
			slug: service.slug,
			description: service.description,
			categoryId: service.categoryId,
			price: service.price || 0,
			status: service.isActive !== undefined 
				? (service.isActive ? 'active' : 'inactive')
				: service.status || 'active',
			serviceType: service.serviceType || 'standard',
			duration: service.duration,
			currency: service.currency || 'INR',
			bookUrl: service.bookUrl || '',
		});
		setIsServiceModalOpen(true);
	};

	const handleCategoryEdit = (category: ServiceCategory) => {
		setEditingCategory(category);
		setCategoryFormData({
			name: category.name,
			description: category.description || '',
		});
		setIsCategoryModalOpen(true);
	};

	const resetServiceForm = () => {
		setServiceFormData({
			name: '',
			description: '',
			categoryId: '',
			price: 0,
			status: 'active',
			serviceType: 'standard',
			currency: 'INR',
			bookUrl: '',
		});
		setEditingService(null);
		setIsServiceModalOpen(false);
	};

	const resetCategoryForm = () => {
		setCategoryFormData({
			name: '',
			description: '',
		});
		setEditingCategory(null);
		setIsCategoryModalOpen(false);
	};

	// Services are already filtered by API, so we can use them directly
	const filteredServices = services;

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1
						className="text-3xl font-bold"
						style={{ color: colors.textPrimary }}
					>
						Services Management
					</h1>
					<p style={{ color: colors.gray }}>
						Manage services and their categories
					</p>
				</div>
				<div className="flex gap-2">
					<Button
						variant="outline"
						onClick={() => {
							resetCategoryForm();
							setIsCategoryModalOpen(true);
						}}
					>
						<Folder className="mr-2 h-4 w-4" />
						Add Category
					</Button>
					<Button
						onClick={() => {
							resetServiceForm();
							setIsServiceModalOpen(true);
						}}
						style={{ backgroundColor: colors.primary }}
					>
						<Plus className="mr-2 h-4 w-4" />
						Add Service
					</Button>
				</div>
			</div>

			{/* Categories Section */}
			<Card>
				<CardHeader>
					<CardTitle>Service Categories</CardTitle>
					<CardDescription>Manage service categories</CardDescription>
				</CardHeader>
				<CardContent>
					{loading ? (
						<div className="flex gap-2">
							{[1, 2, 3].map((i) => (
								<Skeleton key={i} className="h-8 w-24" />
							))}
						</div>
					) : categories.length === 0 ? (
						<p className="text-sm" style={{ color: colors.gray }}>
							No categories yet. Create your first category!
						</p>
					) : (
						<div className="flex flex-wrap gap-2">
							<Button
								variant={selectedCategory === 'all' ? 'default' : 'outline'}
								size="sm"
								onClick={() => setSelectedCategory('all')}
							>
								All
							</Button>
							{categories.map((category) => (
								<div key={category.id} className="flex items-center gap-1">
									<Button
										variant={selectedCategory === category.id ? 'default' : 'outline'}
										size="sm"
										onClick={() => setSelectedCategory(category.id)}
									>
										{category.name}
									</Button>
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8"
										onClick={() => handleCategoryEdit(category)}
									>
										<Edit className="h-3 w-3" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 text-red-600"
										onClick={() => handleCategoryDelete(category.id)}
									>
										<Trash2 className="h-3 w-3" />
									</Button>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Search */}
			<Card>
				<CardContent className="pt-6">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
						<Input
							placeholder="Search services..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
				</CardContent>
			</Card>

			{/* Services List */}
			{loading ? (
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<Card key={i}>
							<CardContent className="pt-6">
								<Skeleton className="h-6 w-1/3 mb-2" />
								<Skeleton className="h-4 w-full" />
							</CardContent>
						</Card>
					))}
				</div>
			) : filteredServices.length === 0 ? (
				<Card>
					<CardContent className="pt-6 text-center py-12">
						<Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
						<p style={{ color: colors.gray }}>
							No services found. Create your first service!
						</p>
					</CardContent>
				</Card>
			) : (
				<>
					<div className="space-y-4">
						{filteredServices.map((service) => (
							<Card key={service.id}>
								<CardContent className="pt-6">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<div className="flex items-center gap-3 mb-2">
												<h3
													className="text-xl font-semibold"
													style={{ color: colors.textPrimary }}
												>
													{service.name}
												</h3>
												<Badge className={(service.isActive !== undefined ? service.isActive : service.status === 'active') ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
													{service.isActive !== undefined ? (service.isActive ? 'active' : 'inactive') : (service.status || 'active')}
												</Badge>
												{service.category && (
													<Badge variant="outline">
														{service.category.name}
													</Badge>
												)}
											</div>
											<p
												className="text-sm mb-3"
												style={{ color: colors.gray }}
											>
												{service.description}
											</p>
											<div className="flex items-center gap-4 mb-2">
												{service.price !== undefined && service.price > 0 && (
													<p className="text-lg font-semibold" style={{ color: colors.primary }}>
														{service.currency || 'INR'} {service.price}
													</p>
												)}
												{service.bookUrl && (
													<p>Booking Url: 
													<a
														href={service.bookUrl}
														target="_blank"
														rel="noopener noreferrer"
														className="text-sm ml-1 text-blue-600 hover:underline"
													>
														{service.bookUrl}
													</a>
													</p>
												)}
											</div>
										</div>
										<div className="flex gap-2 ml-4">
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleServiceEdit(service)}
											>
												<Edit className="h-4 w-4" />
											</Button>
											<Button
												variant="destructive"
												size="sm"
												onClick={() => handleServiceDelete(service.id)}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
					{totalPages > 1 && (
						<div className="mt-6 flex justify-center">
							<Pagination>
								<PaginationContent>
									<PaginationItem>
										<PaginationPrevious
											onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
											className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
										/>
									</PaginationItem>
									{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
										if (
											page === 1 ||
											page === totalPages ||
											(page >= currentPage - 1 && page <= currentPage + 1)
										) {
											return (
												<PaginationItem key={page}>
													<PaginationLink
														onClick={() => setCurrentPage(page)}
														isActive={currentPage === page}
														className="cursor-pointer"
													>
														{page}
													</PaginationLink>
												</PaginationItem>
											);
										} else if (page === currentPage - 2 || page === currentPage + 2) {
											return (
												<PaginationItem key={page}>
													<span className="px-2">...</span>
												</PaginationItem>
											);
										}
										return null;
									})}
									<PaginationItem>
										<PaginationNext
											onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
											className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
										/>
									</PaginationItem>
								</PaginationContent>
							</Pagination>
						</div>
					)}
				</>
			)}

			{/* Service Modal */}
			{isServiceModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle>
									{editingService ? 'Edit Service' : 'Create New Service'}
								</CardTitle>
								<Button
									variant="ghost"
									size="icon"
									onClick={resetServiceForm}
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleServiceSubmit} className="space-y-4">
								<div>
									<Label htmlFor="serviceName">Name *</Label>
									<Input
										id="serviceName"
										value={serviceFormData.name}
										onChange={(e) =>
											setServiceFormData({ ...serviceFormData, name: e.target.value })
										}
										required
									/>
								</div>
								<div>
									<Label htmlFor="serviceDescription">Description *</Label>
									<Textarea
										id="serviceDescription"
										value={serviceFormData.description}
										onChange={(e) =>
											setServiceFormData({ ...serviceFormData, description: e.target.value })
										}
										required
										rows={4}
									/>
								</div>
								<div>
									<Label htmlFor="serviceCategory">Category *</Label>
									<select
										id="serviceCategory"
										value={serviceFormData.categoryId}
										onChange={(e) =>
											setServiceFormData({ ...serviceFormData, categoryId: e.target.value })
										}
										className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
										required
									>
										<option value="">Select a category</option>
										{categories.map((cat) => (
											<option key={cat.id} value={cat.id}>
												{cat.name}
											</option>
										))}
									</select>
								</div>
								<div>
									<Label htmlFor="servicePrice">Price</Label>
									<Input
										id="servicePrice"
										type="number"
										step="0.01"
										min="0"
										value={serviceFormData.price}
										onChange={(e) =>
											setServiceFormData({ ...serviceFormData, price: parseFloat(e.target.value) || 0 })
										}
									/>
								</div>
								<div>
									<Label htmlFor="serviceBookUrl">Booking URL</Label>
									<Input
										id="serviceBookUrl"
										type="url"
										placeholder="https://example.com/book"
										value={serviceFormData.bookUrl || ''}
										onChange={(e) =>
											setServiceFormData({ ...serviceFormData, bookUrl: e.target.value })
										}
									/>
								</div>
								<div>
									<Label htmlFor="serviceStatus">Status *</Label>
									<select
										id="serviceStatus"
										value={serviceFormData.status}
										onChange={(e) =>
											setServiceFormData({
												...serviceFormData,
												status: e.target.value as Service['status'],
											})
										}
										className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
										required
									>
										<option value="active">Active</option>
										<option value="inactive">Inactive</option>
									</select>
								</div>
								<div className="flex justify-end gap-2 pt-4">
									<Button
										type="button"
										variant="outline"
										onClick={resetServiceForm}
									>
										Cancel
									</Button>
									<Button
										type="submit"
										style={{ backgroundColor: colors.primary }}
									>
										<Save className="mr-2 h-4 w-4" />
										{editingService ? 'Update' : 'Create'}
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Category Modal */}
			{isCategoryModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<Card className="w-full max-w-md">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle>
									{editingCategory ? 'Edit Category' : 'Create New Category'}
								</CardTitle>
								<Button
									variant="ghost"
									size="icon"
									onClick={resetCategoryForm}
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleCategorySubmit} className="space-y-4">
								<div>
									<Label htmlFor="categoryName">Name *</Label>
									<Input
										id="categoryName"
										value={categoryFormData.name}
										onChange={(e) =>
											setCategoryFormData({ ...categoryFormData, name: e.target.value })
										}
										required
									/>
								</div>
								<div>
									<Label htmlFor="categoryDescription">Description</Label>
									<Textarea
										id="categoryDescription"
										value={categoryFormData.description}
										onChange={(e) =>
											setCategoryFormData({ ...categoryFormData, description: e.target.value })
										}
										rows={3}
									/>
								</div>
								<div className="flex justify-end gap-2 pt-4">
									<Button
										type="button"
										variant="outline"
										onClick={resetCategoryForm}
									>
										Cancel
									</Button>
									<Button
										type="submit"
										style={{ backgroundColor: colors.primary }}
									>
										<Save className="mr-2 h-4 w-4" />
										{editingCategory ? 'Update' : 'Create'}
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
};

