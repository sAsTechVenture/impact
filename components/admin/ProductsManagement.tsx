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
	ShoppingBag,
	Plus,
	Edit,
	Trash2,
	Search,
	X,
	Save,
	Folder,
} from 'lucide-react';
import { api } from '@/utils/api';

interface ProductCategory {
	id: string;
	name: string;
	slug?: string;
	description?: string;
	createdAt?: string;
}

interface Product {
	id: string;
	name: string;
	slug?: string;
	description: string;
	categoryId: string;
	category?: ProductCategory;
	price: number;
	stock?: number;
	sku?: string;
	status?: 'active' | 'inactive' | 'out_of_stock';
	isActive?: boolean;
	isAvailable?: boolean;
	currency?: string;
	imageUrl?: string;
	createdAt?: string;
	updatedAt?: string;
}

export const ProductsManagement: React.FC = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<ProductCategory[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState<string>('all');
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);
	const ITEMS_PER_PAGE = 5;
	const [isProductModalOpen, setIsProductModalOpen] = useState(false);
	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);
	const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
	const [productFormData, setProductFormData] = useState<Partial<Product>>({
		name: '',
		description: '',
		categoryId: '',
		price: 0,
		stock: 0,
		status: 'active',
		currency: 'INR',
	});
	const [categoryFormData, setCategoryFormData] = useState<Partial<ProductCategory>>({
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
			const [productsRes, categoriesRes] = await Promise.all([
				api.products.list(currentPage, ITEMS_PER_PAGE, searchTerm, selectedCategory !== 'all' ? selectedCategory : undefined),
				api.productCategories.list(1, 100),
			]);
			setProducts(productsRes.data || []);
			setCategories(categoriesRes.data || []);
			setTotalPages(productsRes.totalPages || 1);
			setTotal(productsRes.total || 0);
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleProductSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			// Prepare data for API - ensure slug is generated if not provided
			const productData = {
				...productFormData,
				slug: editingProduct?.slug || generateSlug(productFormData.name || ''),
			};
			
			if (editingProduct) {
				await api.products.update(editingProduct.id, productData);
			} else {
				await api.products.create(productData);
			}
			resetProductForm();
			fetchData();
		} catch (error) {
			console.error('Error saving product:', error);
			alert('Failed to save product. Please try again.');
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
				await api.productCategories.update(editingCategory.id, categoryData);
			} else {
				await api.productCategories.create(categoryData);
			}
			resetCategoryForm();
			fetchData();
		} catch (error) {
			console.error('Error saving category:', error);
			alert('Failed to save category. Please try again.');
		}
	};

	const handleProductDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this product?')) return;
		try {
			await api.products.delete(id);
			fetchData();
		} catch (error) {
			console.error('Error deleting product:', error);
			alert('Failed to delete product. Please try again.');
		}
	};

	const handleCategoryDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this category? All products in this category will be affected.')) return;
		try {
			await api.productCategories.delete(id);
			fetchData();
		} catch (error) {
			console.error('Error deleting category:', error);
			alert('Failed to delete category. Please try again.');
		}
	};

	const handleProductEdit = (product: Product) => {
		setEditingProduct(product);
		setProductFormData({
			name: product.name,
			slug: product.slug,
			description: product.description,
			categoryId: product.categoryId,
			price: product.price,
			stock: product.stock || 0,
			sku: product.sku,
			status: product.isActive !== undefined 
				? (product.isActive ? 'active' : 'inactive')
				: product.status || 'active',
			currency: product.currency || 'INR',
		});
		setIsProductModalOpen(true);
	};

	const handleCategoryEdit = (category: ProductCategory) => {
		setEditingCategory(category);
		setCategoryFormData({
			name: category.name,
			description: category.description || '',
		});
		setIsCategoryModalOpen(true);
	};

	const resetProductForm = () => {
		setProductFormData({
			name: '',
			description: '',
			categoryId: '',
			price: 0,
			stock: 0,
			status: 'active',
			currency: 'INR',
		});
		setEditingProduct(null);
		setIsProductModalOpen(false);
	};

	const resetCategoryForm = () => {
		setCategoryFormData({
			name: '',
			description: '',
		});
		setEditingCategory(null);
		setIsCategoryModalOpen(false);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active':
				return 'bg-green-100 text-green-800';
			case 'inactive':
				return 'bg-gray-100 text-gray-800';
			case 'out_of_stock':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	// Products are already filtered by API, so we can use them directly
	const filteredProducts = products;

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1
						className="text-3xl font-bold"
						style={{ color: colors.textPrimary }}
					>
						Products Management
					</h1>
					<p style={{ color: colors.gray }}>
						Manage products and their categories
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
							resetProductForm();
							setIsProductModalOpen(true);
						}}
						style={{ backgroundColor: colors.primary }}
					>
						<Plus className="mr-2 h-4 w-4" />
						Add Product
					</Button>
				</div>
			</div>

			{/* Categories Section */}
			<Card>
				<CardHeader>
					<CardTitle>Product Categories</CardTitle>
					<CardDescription>Manage product categories</CardDescription>
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
							placeholder="Search products..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
				</CardContent>
			</Card>

			{/* Products List */}
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
			) : filteredProducts.length === 0 ? (
				<Card>
					<CardContent className="pt-6 text-center py-12">
						<ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
						<p style={{ color: colors.gray }}>
							No products found. Create your first product!
						</p>
					</CardContent>
				</Card>
			) : (
				<>
					<div className="space-y-4">
						{filteredProducts.map((product) => (
							<Card key={product.id}>
								<CardContent className="pt-6">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<div className="flex items-center gap-3 mb-2">
												<h3
													className="text-xl font-semibold"
													style={{ color: colors.textPrimary }}
												>
													{product.name}
												</h3>
												<Badge className={getStatusColor(
													product.isActive !== undefined 
														? (product.isActive ? 'active' : 'inactive')
														: (product.status || 'active')
												)}>
													{(product.isActive !== undefined 
														? (product.isActive ? 'active' : 'inactive')
														: (product.status || 'active')
													).replace('_', ' ')}
												</Badge>
												{product.category && (
													<Badge variant="outline">
														{product.category.name}
													</Badge>
												)}
											</div>
											<p
												className="text-sm mb-3"
												style={{ color: colors.gray }}
											>
												{product.description}
											</p>
											<div className="flex flex-wrap gap-4 text-sm items-center">
												{product.price !== undefined && product.price > 0 && (
													<p className="text-lg font-semibold" style={{ color: colors.primary }}>
														{product.currency || 'INR'} {product.price}
													</p>
												)}
												{product.sku && (
													<p style={{ color: colors.gray }}>
														SKU: <span style={{ color: colors.textPrimary }}>{product.sku}</span>
													</p>
												)}
												{product.stock !== undefined && (
													<p style={{ color: colors.gray }}>
														Stock: <span style={{ color: colors.textPrimary }}>{product.stock}</span>
													</p>
												)}
												{product.isAvailable === false && (
													<Badge className="bg-red-100 text-red-800">Not Available</Badge>
												)}
											</div>
										</div>
										<div className="flex gap-2 ml-4">
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleProductEdit(product)}
											>
												<Edit className="h-4 w-4" />
											</Button>
											<Button
												variant="destructive"
												size="sm"
												onClick={() => handleProductDelete(product.id)}
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

			{/* Product Modal */}
			{isProductModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle>
									{editingProduct ? 'Edit Product' : 'Create New Product'}
								</CardTitle>
								<Button
									variant="ghost"
									size="icon"
									onClick={resetProductForm}
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleProductSubmit} className="space-y-4">
								<div>
									<Label htmlFor="productName">Name *</Label>
									<Input
										id="productName"
										value={productFormData.name}
										onChange={(e) =>
											setProductFormData({ ...productFormData, name: e.target.value })
										}
										required
									/>
								</div>
								<div>
									<Label htmlFor="productDescription">Description *</Label>
									<Textarea
										id="productDescription"
										value={productFormData.description}
										onChange={(e) =>
											setProductFormData({ ...productFormData, description: e.target.value })
										}
										required
										rows={4}
									/>
								</div>
								<div>
									<Label htmlFor="productCategory">Category *</Label>
									<select
										id="productCategory"
										value={productFormData.categoryId}
										onChange={(e) =>
											setProductFormData({ ...productFormData, categoryId: e.target.value })
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
									<Label htmlFor="productSku">SKU (Optional)</Label>
									<Input
										id="productSku"
										value={productFormData.sku || ''}
										onChange={(e) =>
											setProductFormData({ ...productFormData, sku: e.target.value })
										}
										placeholder="Product SKU"
									/>
								</div>
								<div className="grid grid-cols-3 gap-4">
									<div>
										<Label htmlFor="productPrice">Price *</Label>
										<Input
											id="productPrice"
											type="number"
											step="0.01"
											min="0"
											value={productFormData.price}
											onChange={(e) =>
												setProductFormData({ ...productFormData, price: parseFloat(e.target.value) || 0 })
											}
											required
										/>
									</div>
									<div>
										<Label htmlFor="productCurrency">Currency</Label>
										<select
											id="productCurrency"
											value={productFormData.currency || 'INR'}
											onChange={(e) =>
												setProductFormData({ ...productFormData, currency: e.target.value })
											}
											className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
										>
											<option value="INR">INR</option>
											<option value="USD">USD</option>
											<option value="EUR">EUR</option>
										</select>
									</div>
									<div>
										<Label htmlFor="productStock">Stock</Label>
										<Input
											id="productStock"
											type="number"
											min="0"
											value={productFormData.stock}
											onChange={(e) =>
												setProductFormData({ ...productFormData, stock: parseInt(e.target.value) || 0 })
											}
										/>
									</div>
								</div>
								<div>
									<Label htmlFor="productStatus">Status *</Label>
									<select
										id="productStatus"
										value={productFormData.status}
										onChange={(e) =>
											setProductFormData({
												...productFormData,
												status: e.target.value as Product['status'],
											})
										}
										className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
										required
									>
										<option value="active">Active</option>
										<option value="inactive">Inactive</option>
										<option value="out_of_stock">Out of Stock</option>
									</select>
								</div>
								<div className="flex justify-end gap-2 pt-4">
									<Button
										type="button"
										variant="outline"
										onClick={resetProductForm}
									>
										Cancel
									</Button>
									<Button
										type="submit"
										style={{ backgroundColor: colors.primary }}
									>
										<Save className="mr-2 h-4 w-4" />
										{editingProduct ? 'Update' : 'Create'}
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

