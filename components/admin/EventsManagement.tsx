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
	Calendar,
	Plus,
	Edit,
	Trash2,
	Search,
	X,
	Save,
} from 'lucide-react';
import { api } from '@/utils/api';

interface Event {
	id: string;
	title: string;
	description: string;
	startDate: string;
	endDate: string;
	location?: string;
	status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
	imageUrl?: string;
	createdAt?: string;
	updatedAt?: string;
}

export const EventsManagement: React.FC = () => {
	const [events, setEvents] = useState<Event[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingEvent, setEditingEvent] = useState<Event | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);
	const ITEMS_PER_PAGE = 5;
	const [formData, setFormData] = useState<Partial<Event> & { slug?: string }>({
		title: '',
		slug: '',
		description: '',
		startDate: '',
		endDate: '',
		location: '',
		status: 'upcoming',
	});

	useEffect(() => {
		fetchEvents();
	}, [currentPage, searchTerm]);

	// Reset to page 1 when search term changes
	useEffect(() => {
		if (searchTerm !== '') {
			setCurrentPage(1);
		}
	}, [searchTerm]);

	const fetchEvents = async () => {
		try {
			setLoading(true);
			const response = await api.events.list(currentPage, ITEMS_PER_PAGE, searchTerm);
			setEvents(response.data || []);
			setTotalPages(response.totalPages || 1);
			setTotal(response.total || 0);
		} catch (error) {
			console.error('Error fetching events:', error);
		} finally {
			setLoading(false);
		}
	};

	// Auto-generate slug from title
	const generateSlug = (title: string): string => {
		return title
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, '')
			.replace(/[\s_-]+/g, '-')
			.replace(/^-+|-+$/g, '');
	};

	const handleTitleChange = (title: string) => {
		setFormData({
			...formData,
			title,
			slug: editingEvent ? formData.slug : generateSlug(title),
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			// Ensure slug is generated if missing
			const slug = formData.slug || generateSlug(formData.title || '');
			
			// Format dates properly - add time if only date is provided
			const startDate = formData.startDate 
				? formData.startDate.includes('T') 
					? formData.startDate 
					: `${formData.startDate}T00:00:00`
				: '';
			
			const endDate = formData.endDate 
				? formData.endDate.includes('T') 
					? formData.endDate 
					: `${formData.endDate}T23:59:59`
				: null;

			const submitData = {
				...formData,
				slug,
				startDate,
				endDate: endDate || undefined,
			};

			if (editingEvent) {
				await api.events.update(editingEvent.id, submitData);
			} else {
				await api.events.create(submitData);
			}
			resetForm();
			fetchEvents();
		} catch (error) {
			console.error('Error saving event:', error);
			alert('Failed to save event. Please try again.');
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this event?')) return;
		try {
			await api.events.delete(id);
			fetchEvents();
		} catch (error) {
			console.error('Error deleting event:', error);
			alert('Failed to delete event. Please try again.');
		}
	};

	const handleEdit = (event: Event) => {
		setEditingEvent(event);
		setFormData({
			title: event.title,
			slug: (event as any).slug || '',
			description: event.description,
			startDate: event.startDate ? event.startDate.split('T')[0] : '',
			endDate: event.endDate ? event.endDate.split('T')[0] : '',
			location: event.location || '',
			status: event.status,
		});
		setIsModalOpen(true);
	};

	const resetForm = () => {
		setFormData({
			title: '',
			slug: '',
			description: '',
			startDate: '',
			endDate: '',
			location: '',
			status: 'upcoming',
		});
		setEditingEvent(null);
		setIsModalOpen(false);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'upcoming':
				return 'bg-blue-100 text-blue-800';
			case 'ongoing':
				return 'bg-green-100 text-green-800';
			case 'completed':
				return 'bg-gray-100 text-gray-800';
			case 'cancelled':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	// Events are already filtered by API, so we can use them directly
	const filteredEvents = events;

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1
						className="text-3xl font-bold"
						style={{ color: colors.textPrimary }}
					>
						Events Management
					</h1>
					<p style={{ color: colors.gray }}>
						Manage all events and activities
					</p>
				</div>
				<Button
					onClick={() => {
						resetForm();
						setIsModalOpen(true);
					}}
					style={{ backgroundColor: colors.primary }}
				>
					<Plus className="mr-2 h-4 w-4" />
					Add Event
				</Button>
			</div>

			{/* Search */}
			<Card>
				<CardContent className="pt-6">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
						<Input
							placeholder="Search events..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
				</CardContent>
			</Card>

			{/* Events List */}
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
			) : filteredEvents.length === 0 ? (
				<Card>
					<CardContent className="pt-6 text-center py-12">
						<Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
						<p style={{ color: colors.gray }}>
							No events found. Create your first event!
						</p>
					</CardContent>
				</Card>
			) : (
				<>
					<div className="space-y-4">
						{filteredEvents.map((event) => (
							<Card key={event.id}>
								<CardContent className="pt-6">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<div className="flex items-center gap-3 mb-2">
												<h3
													className="text-xl font-semibold"
													style={{ color: colors.textPrimary }}
												>
													{event.title}
												</h3>
												<Badge className={getStatusColor(event.status)}>
													{event.status}
												</Badge>
											</div>
											<p
												className="text-sm mb-3"
												style={{ color: colors.gray }}
											>
												{event.description}
											</p>
											<div className="flex flex-wrap gap-4 text-sm">
												<div>
													<span style={{ color: colors.gray }}>Start: </span>
													<span style={{ color: colors.textPrimary }}>
														{new Date(event.startDate).toLocaleDateString()}
													</span>
												</div>
												<div>
													<span style={{ color: colors.gray }}>End: </span>
													<span style={{ color: colors.textPrimary }}>
														{new Date(event.endDate).toLocaleDateString()}
													</span>
												</div>
												{event.location && (
													<div>
														<span style={{ color: colors.gray }}>Location: </span>
														<span style={{ color: colors.textPrimary }}>
															{event.location}
														</span>
													</div>
												)}
											</div>
										</div>
										<div className="flex gap-2 ml-4">
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleEdit(event)}
											>
												<Edit className="h-4 w-4" />
											</Button>
											<Button
												variant="destructive"
												size="sm"
												onClick={() => handleDelete(event.id)}
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

			{/* Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle>
									{editingEvent ? 'Edit Event' : 'Create New Event'}
								</CardTitle>
								<Button
									variant="ghost"
									size="icon"
									onClick={resetForm}
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div>
									<Label htmlFor="title">Title *</Label>
									<Input
										id="title"
										value={formData.title}
										onChange={(e) => handleTitleChange(e.target.value)}
										required
									/>
								</div>
								<div>
									<Label htmlFor="slug">Slug *</Label>
									<Input
										id="slug"
										value={formData.slug}
										onChange={(e) =>
											setFormData({ ...formData, slug: e.target.value })
										}
										required
										placeholder="auto-generated-from-title"
									/>
								</div>
								<div>
									<Label htmlFor="description">Description *</Label>
									<Textarea
										id="description"
										value={formData.description}
										onChange={(e) =>
											setFormData({ ...formData, description: e.target.value })
										}
										required
										rows={4}
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="startDate">Start Date *</Label>
										<Input
											id="startDate"
											type="date"
											value={formData.startDate}
											onChange={(e) =>
												setFormData({ ...formData, startDate: e.target.value })
											}
											required
										/>
									</div>
									<div>
										<Label htmlFor="endDate">End Date *</Label>
										<Input
											id="endDate"
											type="date"
											value={formData.endDate}
											onChange={(e) =>
												setFormData({ ...formData, endDate: e.target.value })
											}
											required
										/>
									</div>
								</div>
								<div>
									<Label htmlFor="location">Location</Label>
									<Input
										id="location"
										value={formData.location}
										onChange={(e) =>
											setFormData({ ...formData, location: e.target.value })
										}
									/>
								</div>
								<div>
									<Label htmlFor="status">Status *</Label>
									<select
										id="status"
										value={formData.status}
										onChange={(e) =>
											setFormData({
												...formData,
												status: e.target.value as Event['status'],
											})
										}
										className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
										required
									>
										<option value="upcoming">Upcoming</option>
										<option value="ongoing">Ongoing</option>
										<option value="completed">Completed</option>
										<option value="cancelled">Cancelled</option>
									</select>
								</div>
								<div className="flex justify-end gap-2 pt-4">
									<Button
										type="button"
										variant="outline"
										onClick={resetForm}
									>
										Cancel
									</Button>
									<Button
										type="submit"
										style={{ backgroundColor: colors.primary }}
									>
										<Save className="mr-2 h-4 w-4" />
										{editingEvent ? 'Update' : 'Create'}
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

