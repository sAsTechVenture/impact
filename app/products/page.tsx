'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import { Search, ChevronDown } from 'lucide-react';
import { api } from '@/utils/api';
import { colors } from '@/config/theme';

interface Product {
	id: string;
	name: string;
	description: string;
	imageUrl?: string;
	category?: {
		id: string;
		name: string;
	};
	price?: number;
	currency?: string;
	slug?: string;
}

interface ProductCategory {
	id: string;
	name: string;
	slug: string;
}

export default function ProductsPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<ProductCategory[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
	const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all');
	const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);
	const ITEMS_PER_PAGE = 9;

	useEffect(() => {
		fetchCategories();
	}, []);

	useEffect(() => {
		fetchProducts();
	}, [currentPage, searchTerm, selectedCategory]);

	useEffect(() => {
		// Update URL params when filters change
		const params = new URLSearchParams();
		if (searchTerm) params.set('search', searchTerm);
		if (selectedCategory !== 'all') params.set('category', selectedCategory);
		if (currentPage > 1) params.set('page', currentPage.toString());
		router.replace(`/products?${params.toString()}`, { scroll: false });
	}, [searchTerm, selectedCategory, currentPage, router]);

	const fetchCategories = async () => {
		try {
			const response = await api.productCategories.list(1, 100);
			setCategories(response.data || []);
		} catch (error) {
			console.error('Error fetching categories:', error);
		}
	};

	const fetchProducts = async () => {
		try {
			setLoading(true);
			const response = await api.products.list(
				currentPage,
				ITEMS_PER_PAGE,
				searchTerm || undefined,
				selectedCategory !== 'all' ? selectedCategory : undefined
			);
			setProducts(response.data || []);
			setTotalPages(response.totalPages || 1);
			setTotal(response.total || 0);
		} catch (error) {
			console.error('Error fetching products:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		setCurrentPage(1);
		fetchProducts();
	};

	const handleCategoryChange = (categoryId: string) => {
		setSelectedCategory(categoryId);
		setCurrentPage(1);
	};

	return (
		<main className="min-h-screen bg-white">
			{/* Hero Section */}
			<section className="relative py-16 md:py-20 lg:py-24 overflow-hidden">
				<div className="container mx-auto px-4 md:px-6 lg:px-8">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
						<div className="space-y-6 z-10">
							<h1
								className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
								style={{ color: colors.textPrimary }}
							>
								Lorem ipsum dolor sit amet consectetur.
							</h1>
							<p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
								Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient.
							</p>
						</div>
						<div className="relative h-64 md:h-80 lg:h-[450px] xl:h-[500px] rounded-lg overflow-hidden">
							<div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50" />
							<Image
								src="/home/hero-1.jpg"
								alt="Products"
								fill
								className="object-cover mix-blend-overlay"
								priority
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Search and Filter Section */}
			<section className="bg-white py-6 md:py-8 border-b border-gray-200">
				<div className="container mx-auto px-4 md:px-6 lg:px-8">
					<div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
						{/* Search Form */}
						<form onSubmit={handleSearch} className="flex-1 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
							<div className="relative flex-1 min-w-0">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
								<Input
									type="text"
									placeholder="Search for"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10 h-11 md:h-12 w-full"
								/>
							</div>
							<div className="relative flex-shrink-0">
								<select
									value={selectedCategory}
									onChange={(e) => handleCategoryChange(e.target.value)}
									className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2.5 md:py-3 pr-10 h-11 md:h-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer w-full sm:w-auto"
									style={{ minWidth: '160px' }}
								>
									<option value="all">All Categories</option>
									{categories.map((category) => (
										<option key={category.id} value={category.id}>
											{category.name}
										</option>
									))}
								</select>
								<ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
							</div>
							<Button
								type="submit"
								className="h-11 md:h-12 px-6 whitespace-nowrap"
								style={{ backgroundColor: colors.primary }}
							>
								Search
							</Button>
						</form>
					</div>
				</div>
			</section>

			{/* Products Grid Section */}
			<section className="py-12 md:py-16 lg:py-20">
				<div className="container mx-auto px-4 md:px-6 lg:px-8">
					{loading ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
							{[...Array(9)].map((_, i) => (
								<Card key={i} className="overflow-hidden">
									<div className="h-48 bg-gray-200 animate-pulse" />
									<CardContent className="p-6">
										<div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
										<div className="h-6 bg-gray-200 rounded animate-pulse mb-4" />
										<div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
										<div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
									</CardContent>
								</Card>
							))}
						</div>
					) : products.length === 0 ? (
						<div className="text-center py-16">
							<p className="text-xl text-gray-600">No products found.</p>
						</div>
					) : (
						<>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
								{products.map((product) => (
									<Card
										key={product.id}
										className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
									>
										<div className="relative h-48 md:h-56 lg:h-64">
											<Image
												src={product.imageUrl || '/home/hero-1.jpg'}
												alt={product.name}
												fill
												className="object-cover"
												loading="lazy"
											/>
										{product.category && (
											<div className="absolute top-3 left-3">
												<span
													className="px-3 py-1 text-xs font-semibold rounded-full text-white shadow-md"
													style={{ backgroundColor: colors.primary }}
												>
													{product.category.name}
												</span>
											</div>
										)}
										</div>
										<CardContent className="p-5 md:p-6">
											<h3
												className="text-lg md:text-xl lg:text-2xl font-bold mb-2 md:mb-3 line-clamp-2"
												style={{ color: colors.textPrimary }}
											>
												{product.name}
											</h3>
											<p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-3 leading-relaxed">
												{product.description || 'Lorem ipsum dolor sit amet consectetur. Accumsan.'}
											</p>
											<Link href={`/products/${product.id}`}>
												<Button
													className="w-full h-10 md:h-11"
													style={{ backgroundColor: colors.primary }}
												>
													Learn More
												</Button>
											</Link>
										</CardContent>
									</Card>
								))}
							</div>

							{/* Pagination */}
							{totalPages > 1 && (
								<div className="mt-12 flex justify-center">
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
				</div>
			</section>
		</main>
	);
}
