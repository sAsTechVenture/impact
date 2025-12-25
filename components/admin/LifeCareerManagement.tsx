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
import { Skeleton } from '@/components/ui/skeleton';
import { colors } from '@/config/theme';
import {
	Briefcase,
	Save,
	X,
	Edit,
} from 'lucide-react';
import { api } from '@/utils/api';

interface LifeCareerPage {
	id: string;
	title: string;
	heroTitle?: string;
	heroDescription?: string;
	heroImageUrl?: string;
	aboutSection?: string;
	careerSection?: string;
	benefitsSection?: string;
	ctaTitle?: string;
	ctaDescription?: string;
	ctaButtonText?: string;
	metaTitle?: string;
	metaDescription?: string;
	updatedAt?: string;
}

export const LifeCareerManagement: React.FC = () => {
	const [pageData, setPageData] = useState<LifeCareerPage | null>(null);
	const [loading, setLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState<Partial<LifeCareerPage>>({
		title: '',
		heroTitle: '',
		heroDescription: '',
		aboutSection: '',
		careerSection: '',
		benefitsSection: '',
		ctaTitle: '',
		ctaDescription: '',
		ctaButtonText: '',
		metaTitle: '',
		metaDescription: '',
	});

	useEffect(() => {
		fetchPageData();
	}, []);

	const fetchPageData = async () => {
		try {
			setLoading(true);
			// TODO: Replace with actual API call when backend is ready
			// const response = await api.lifeCareer.get();
			// setPageData(response);
			// if (response) {
			// 	setFormData(response);
			// }
			
			// Mock data for now
			setPageData(null);
		} catch (error) {
			console.error('Error fetching page data:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (pageData) {
				// await api.lifeCareer.update(pageData.id, formData);
				console.log('Update page:', pageData.id, formData);
			} else {
				// await api.lifeCareer.create(formData);
				console.log('Create page:', formData);
			}
			setIsEditing(false);
			fetchPageData();
		} catch (error) {
			console.error('Error saving page:', error);
		}
	};

	const handleCancel = () => {
		if (pageData) {
			setFormData(pageData);
		} else {
			setFormData({
				title: '',
				heroTitle: '',
				heroDescription: '',
				aboutSection: '',
				careerSection: '',
				benefitsSection: '',
				ctaTitle: '',
				ctaDescription: '',
				ctaButtonText: '',
				metaTitle: '',
				metaDescription: '',
			});
		}
		setIsEditing(false);
	};

	if (loading) {
		return (
			<div className="space-y-6">
				<Skeleton className="h-10 w-1/3" />
				<Skeleton className="h-64 w-full" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1
						className="text-3xl font-bold"
						style={{ color: colors.textPrimary }}
					>
						Life & Career Page Management
					</h1>
					<p style={{ color: colors.gray }}>
						Manage the content of the Life & Career page
					</p>
				</div>
				{!isEditing && (
					<Button
						onClick={() => {
							if (pageData) {
								setFormData(pageData);
							}
							setIsEditing(true);
						}}
						style={{ backgroundColor: colors.primary }}
					>
						<Edit className="mr-2 h-4 w-4" />
						{pageData ? 'Edit Page' : 'Create Page'}
					</Button>
				)}
			</div>

			{isEditing ? (
				<Card>
					<CardHeader>
						<CardTitle>Edit Page Content</CardTitle>
						<CardDescription>
							Update the Life & Career page content
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Basic Info */}
							<div className="space-y-4">
								<h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
									Basic Information
								</h3>
								<div>
									<Label htmlFor="title">Page Title *</Label>
									<Input
										id="title"
										value={formData.title}
										onChange={(e) =>
											setFormData({ ...formData, title: e.target.value })
										}
										required
									/>
								</div>
							</div>

							{/* Hero Section */}
							<div className="space-y-4">
								<h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
									Hero Section
								</h3>
								<div>
									<Label htmlFor="heroTitle">Hero Title</Label>
									<Input
										id="heroTitle"
										value={formData.heroTitle}
										onChange={(e) =>
											setFormData({ ...formData, heroTitle: e.target.value })
										}
									/>
								</div>
								<div>
									<Label htmlFor="heroDescription">Hero Description</Label>
									<Textarea
										id="heroDescription"
										value={formData.heroDescription}
										onChange={(e) =>
											setFormData({ ...formData, heroDescription: e.target.value })
										}
										rows={4}
									/>
								</div>
							</div>

							{/* About Section */}
							<div className="space-y-4">
								<h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
									About Section
								</h3>
								<div>
									<Label htmlFor="aboutSection">About Content</Label>
									<Textarea
										id="aboutSection"
										value={formData.aboutSection}
										onChange={(e) =>
											setFormData({ ...formData, aboutSection: e.target.value })
										}
										rows={6}
									/>
								</div>
							</div>

							{/* Career Section */}
							<div className="space-y-4">
								<h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
									Career Section
								</h3>
								<div>
									<Label htmlFor="careerSection">Career Content</Label>
									<Textarea
										id="careerSection"
										value={formData.careerSection}
										onChange={(e) =>
											setFormData({ ...formData, careerSection: e.target.value })
										}
										rows={6}
									/>
								</div>
							</div>

							{/* Benefits Section */}
							<div className="space-y-4">
								<h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
									Benefits Section
								</h3>
								<div>
									<Label htmlFor="benefitsSection">Benefits Content</Label>
									<Textarea
										id="benefitsSection"
										value={formData.benefitsSection}
										onChange={(e) =>
											setFormData({ ...formData, benefitsSection: e.target.value })
										}
										rows={6}
									/>
								</div>
							</div>

							{/* CTA Section */}
							<div className="space-y-4">
								<h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
									Call to Action Section
								</h3>
								<div>
									<Label htmlFor="ctaTitle">CTA Title</Label>
									<Input
										id="ctaTitle"
										value={formData.ctaTitle}
										onChange={(e) =>
											setFormData({ ...formData, ctaTitle: e.target.value })
										}
									/>
								</div>
								<div>
									<Label htmlFor="ctaDescription">CTA Description</Label>
									<Textarea
										id="ctaDescription"
										value={formData.ctaDescription}
										onChange={(e) =>
											setFormData({ ...formData, ctaDescription: e.target.value })
										}
										rows={3}
									/>
								</div>
								<div>
									<Label htmlFor="ctaButtonText">CTA Button Text</Label>
									<Input
										id="ctaButtonText"
										value={formData.ctaButtonText}
										onChange={(e) =>
											setFormData({ ...formData, ctaButtonText: e.target.value })
										}
									/>
								</div>
							</div>

							{/* SEO */}
							<div className="space-y-4">
								<h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
									SEO Settings
								</h3>
								<div>
									<Label htmlFor="metaTitle">Meta Title</Label>
									<Input
										id="metaTitle"
										value={formData.metaTitle}
										onChange={(e) =>
											setFormData({ ...formData, metaTitle: e.target.value })
										}
									/>
								</div>
								<div>
									<Label htmlFor="metaDescription">Meta Description</Label>
									<Textarea
										id="metaDescription"
										value={formData.metaDescription}
										onChange={(e) =>
											setFormData({ ...formData, metaDescription: e.target.value })
										}
										rows={3}
									/>
								</div>
							</div>

							<div className="flex justify-end gap-2 pt-4">
								<Button
									type="button"
									variant="outline"
									onClick={handleCancel}
								>
									<X className="mr-2 h-4 w-4" />
									Cancel
								</Button>
								<Button
									type="submit"
									style={{ backgroundColor: colors.primary }}
								>
									<Save className="mr-2 h-4 w-4" />
									Save Changes
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			) : pageData ? (
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>{pageData.title}</CardTitle>
							<CardDescription>
								Last updated: {pageData.updatedAt ? new Date(pageData.updatedAt).toLocaleDateString() : 'Never'}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{pageData.heroTitle && (
								<div>
									<h3 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>
										Hero Title
									</h3>
									<p style={{ color: colors.gray }}>{pageData.heroTitle}</p>
								</div>
							)}
							{pageData.heroDescription && (
								<div>
									<h3 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>
										Hero Description
									</h3>
									<p style={{ color: colors.gray }}>{pageData.heroDescription}</p>
								</div>
							)}
							{pageData.aboutSection && (
								<div>
									<h3 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>
										About Section
									</h3>
									<p style={{ color: colors.gray }}>{pageData.aboutSection}</p>
								</div>
							)}
							{pageData.careerSection && (
								<div>
									<h3 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>
										Career Section
									</h3>
									<p style={{ color: colors.gray }}>{pageData.careerSection}</p>
								</div>
							)}
							{pageData.benefitsSection && (
								<div>
									<h3 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>
										Benefits Section
									</h3>
									<p style={{ color: colors.gray }}>{pageData.benefitsSection}</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			) : (
				<Card>
					<CardContent className="pt-6 text-center py-12">
						<Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
						<p style={{ color: colors.gray }}>
							No page content found. Create the Life & Career page!
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
};

