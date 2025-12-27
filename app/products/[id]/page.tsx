'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
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
	sku?: string;
	specifications?: any;
	productImages?: Array<{
		id: string;
		imageUrl: string;
		altText?: string;
		isPrimary: boolean;
		sortOrder: number;
	}>;
}

export default function ProductDetailPage() {
	const params = useParams();
	const router = useRouter();
	const productId = params.id as string;
	const [product, setProduct] = useState<Product | null>(null);
	const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadingRelated, setLoadingRelated] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (productId) {
			fetchProduct();
		}
	}, [productId]);

	const fetchProduct = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await api.products.get(productId);
			setProduct(data);
			// Fetch related products if category exists
			if (data?.category?.id) {
				fetchRelatedProducts(data.category.id, productId);
			}
		} catch (err) {
			console.error('Error fetching product:', err);
			setError('Product not found');
		} finally {
			setLoading(false);
		}
	};

	const fetchRelatedProducts = async (categoryId: string, excludeProductId: string) => {
		try {
			setLoadingRelated(true);
			const response = await api.products.list(1, 6, undefined, categoryId);
			// Filter out the current product
			const filtered = (response.data || []).filter(p => p.id !== excludeProductId);
			setRelatedProducts(filtered);
		} catch (err) {
			console.error('Error fetching related products:', err);
			setRelatedProducts([]);
		} finally {
			setLoadingRelated(false);
		}
	};

	if (loading) {
		return (
			<main className="min-h-screen bg-white py-12">
				<div className="container mx-auto px-4 md:px-6 lg:px-8">
					<div className="animate-pulse">
						<div className="h-8 bg-gray-200 rounded w-32 mb-8" />
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							<div className="h-96 bg-gray-200 rounded" />
							<div className="space-y-4">
								<div className="h-8 bg-gray-200 rounded w-3/4" />
								<div className="h-4 bg-gray-200 rounded w-full" />
								<div className="h-4 bg-gray-200 rounded w-5/6" />
							</div>
						</div>
					</div>
				</div>
			</main>
		);
	}

	if (error || !product) {
		return (
			<main className="min-h-screen bg-white py-12">
				<div className="container mx-auto px-4 md:px-6 lg:px-8">
					<div className="text-center py-16">
						<h1 className="text-2xl font-bold mb-4" style={{ color: colors.textPrimary }}>
							{error || 'Product not found'}
						</h1>
						<Link href="/products">
							<Button style={{ backgroundColor: colors.primary }}>
								Back to Products
							</Button>
						</Link>
					</div>
				</div>
			</main>
		);
	}

	const images = product.productImages && product.productImages.length > 0
		? product.productImages.map(img => img.imageUrl)
		: product.imageUrl
			? [product.imageUrl]
			: ['/home/hero-1.jpg'];

	return (
		<main className="min-h-screen bg-white py-8 md:py-12">
			<div className="container mx-auto px-4 md:px-6 lg:px-8">
				{/* Back Button */}
				<Link href="/products">
					<Button
						variant="ghost"
						className="mb-6"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Products
					</Button>
				</Link>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
					{/* Product Images */}
					<div className="space-y-4">
						<div className="relative aspect-square rounded-lg overflow-hidden">
							<Image
								src={images[0]}
								alt={product.name}
								fill
								className="object-cover"
								priority
							/>
						</div>
						{images.length > 1 && (
							<div className="grid grid-cols-4 gap-4">
								{images.slice(1, 5).map((img, index) => (
									<div key={index} className="relative aspect-square rounded-lg overflow-hidden">
										<Image
											src={img}
											alt={`${product.name} ${index + 2}`}
											fill
											className="object-cover"
										/>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Product Details */}
					<div className="space-y-6">
						{product.category && (
							<span
								className="inline-block px-4 py-2 text-sm font-semibold rounded-full text-white"
								style={{ backgroundColor: colors.primary }}
							>
								{product.category.name}
							</span>
						)}
						
						<h1
							className="text-3xl md:text-4xl lg:text-5xl font-bold"
							style={{ color: colors.textPrimary }}
						>
							{product.name}
						</h1>

						{product.price && (
							<div className="flex items-baseline gap-2">
								<span className="text-3xl font-bold" style={{ color: colors.primary }}>
									{product.currency || 'INR'} {product.price.toLocaleString()}
								</span>
							</div>
						)}

						{product.sku && (
							<div>
								<span className="text-sm text-gray-600">SKU: </span>
								<span className="text-sm font-medium">{product.sku}</span>
							</div>
						)}

						<div className="prose max-w-none">
							<p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
								{product.description}
							</p>
						</div>

						{product.specifications && (
							<div>
								<h3 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>
									Specifications
								</h3>
								<div className="bg-gray-50 rounded-lg p-6">
									{typeof product.specifications === 'object' ? (
										<ul className="space-y-2">
											{Object.entries(product.specifications).map(([key, value]) => (
												<li key={key} className="flex justify-between border-b pb-2">
													<span className="font-medium text-gray-700">{key}:</span>
													<span className="text-gray-600">{String(value)}</span>
												</li>
											))}
										</ul>
									) : (
										<p className="text-gray-700">{String(product.specifications)}</p>
									)}
								</div>
							</div>
						)}

						<div className="flex gap-4 pt-4">
							<Button
								size="lg"
								className="flex-1"
								style={{ backgroundColor: colors.primary }}
								onClick={() => {
									// Scroll to contact section or open contact form
									window.location.href = '/#contact';
								}}
							>
								Contact Us
							</Button>
							<Button
								size="lg"
								variant="outline"
								onClick={() => {
									window.location.href = 'tel:+919999999999';
								}}
							>
								Call Now
							</Button>
						</div>
					</div>
				</div>

				{/* Related Products Section */}
				{relatedProducts.length > 0 ? (
					<div className="mt-16 pt-12 border-t">
						<h2 className="text-2xl md:text-3xl font-bold mb-8" style={{ color: colors.textPrimary }}>
							Related Products
						</h2>
						{loadingRelated ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
								{[...Array(3)].map((_, i) => (
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
						) : (
							<>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
									{relatedProducts.map((relatedProduct) => (
										<Card
											key={relatedProduct.id}
											className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
										>
											<div className="relative h-48 md:h-56 lg:h-64">
												<Image
													src={relatedProduct.imageUrl || '/home/hero-1.jpg'}
													alt={relatedProduct.name}
													fill
													className="object-cover"
													loading="lazy"
												/>
												{relatedProduct.category && (
													<div className="absolute top-3 left-3">
														<span
															className="px-3 py-1 text-xs font-semibold rounded-full text-white shadow-md"
															style={{ backgroundColor: colors.primary }}
														>
															{relatedProduct.category.name}
														</span>
													</div>
												)}
											</div>
											<CardContent className="p-5 md:p-6">
												<h3
													className="text-lg md:text-xl lg:text-2xl font-bold mb-2 md:mb-3 line-clamp-2"
													style={{ color: colors.textPrimary }}
												>
													{relatedProduct.name}
												</h3>
												<p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-3 leading-relaxed">
													{relatedProduct.description || 'Lorem ipsum dolor sit amet consectetur. Accumsan.'}
												</p>
												{relatedProduct.price && (
													<div className="mb-4">
														<span className="text-lg font-bold" style={{ color: colors.primary }}>
															{relatedProduct.currency || 'INR'} {relatedProduct.price.toLocaleString()}
														</span>
													</div>
												)}
												<Link href={`/products/${relatedProduct.id}`}>
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
								<div className="text-center mt-8">
									<Link href="/products">
										<Button variant="outline" size="lg">
											View All Products
										</Button>
									</Link>
								</div>
							</>
						)}
					</div>
				) : (
					<div className="mt-16 pt-12 border-t">
						<div className="text-center py-8">
							<p className="text-gray-600 mb-4">Explore more of our products</p>
							<Link href="/products">
								<Button style={{ backgroundColor: colors.primary }}>
									View All Products
								</Button>
							</Link>
						</div>
					</div>
				)}
			</div>
		</main>
	);
}

