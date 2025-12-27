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
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { colors } from '@/config/theme';
import {
	Briefcase,
	Save,
	X,
	Edit,
	Trash2,
	Plus,
	Users,
	Search,
	Building2,
	Loader2,
} from 'lucide-react';
import { api } from '@/utils/api';

interface Department {
	id: string;
	name: string;
	description?: string;
	isActive: boolean;
}

interface JobPosting {
	id: string;
	title: string;
	slug: string;
	departmentId: string;
	department?: Department;
	jobType: string;
	location: string;
	isRemote: boolean;
	description?: string;
	requirements?: string;
	salaryMin?: number;
	salaryMax?: number;
	currency: string;
	applicationDeadline?: string;
	applicationEmail?: string;
	isActive: boolean;
	isFeatured: boolean;
	postedAt: string;
	_count?: {
		applications: number;
	};
}

interface JobApplication {
	id: string;
	jobPostingId: string;
	jobPosting?: {
		title: string;
		department?: {
			name: string;
		};
	};
	firstName: string;
	lastName: string;
	email: string;
	phone?: string;
	status: string;
	appliedAt: string;
}

export const LifeCareerManagement: React.FC = () => {
	const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
	const [departments, setDepartments] = useState<Department[]>([]);
	const [applications, setApplications] = useState<JobApplication[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
	const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);
	const ITEMS_PER_PAGE = 5;
	const [isSubmittingJob, setIsSubmittingJob] = useState(false);
	const [isSubmittingDepartment, setIsSubmittingDepartment] = useState(false);
	const [errorDialog, setErrorDialog] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
	const [deleteJobDialog, setDeleteJobDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
	const [deleteDepartmentDialog, setDeleteDepartmentDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
	const [isJobModalOpen, setIsJobModalOpen] = useState(false);
	const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
	const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
	const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
	const [jobFormData, setJobFormData] = useState<Partial<JobPosting>>({
		title: '',
		slug: '',
		departmentId: '',
		jobType: 'full-time',
		location: '',
		isRemote: false,
		description: '',
		requirements: '',
		salaryMin: undefined,
		salaryMax: undefined,
		currency: 'INR',
		applicationDeadline: '',
		applicationEmail: '',
		isActive: true,
		isFeatured: false,
	});
	const [departmentFormData, setDepartmentFormData] = useState<Partial<Department>>({
		name: '',
		description: '',
		isActive: true,
	});

	useEffect(() => {
		fetchData();
	}, [currentPage, searchTerm, selectedDepartment]);

	// Reset to page 1 when search term or department changes
	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm, selectedDepartment]);

	useEffect(() => {
		if (selectedJobId) {
			fetchApplications(selectedJobId);
		}
	}, [selectedJobId]);

	const fetchData = async () => {
		try {
			setLoading(true);
			const [jobsRes, deptsRes] = await Promise.all([
				api.jobPostings.list(currentPage, ITEMS_PER_PAGE, searchTerm, selectedDepartment !== 'all' ? selectedDepartment : undefined),
				api.departments.list(1, 100),
			]);
			setJobPostings(jobsRes.data || []);
			setDepartments(deptsRes.data || []);
			setTotalPages(jobsRes.totalPages || 1);
			setTotal(jobsRes.total || 0);
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			setLoading(false);
		}
	};

	const fetchApplications = async (jobId: string) => {
		try {
			const job = await api.jobPostings.get(jobId);
			if (job && job.applications) {
				setApplications(job.applications);
			}
		} catch (error) {
			console.error('Error fetching applications:', error);
		}
	};

	// Generate slug from title
	const generateSlug = (title: string): string => {
		return title
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, '')
			.replace(/[\s_-]+/g, '-')
			.replace(/^-+|-+$/g, '');
	};

	const handleJobSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setIsSubmittingJob(true);
			const jobData = {
				...jobFormData,
				slug: editingJob?.slug || generateSlug(jobFormData.title || ''),
			};
			if (editingJob) {
				await api.jobPostings.update(editingJob.id, jobData);
			} else {
				await api.jobPostings.create(jobData);
			}
			resetJobForm();
			fetchData();
		} catch (error: any) {
			console.error('Error saving job posting:', error);
			const errorMessage = error?.response?.error || error?.message || 'Failed to save job posting. Please try again.';
			setErrorDialog({ open: true, message: errorMessage });
		} finally {
			setIsSubmittingJob(false);
		}
	};

	const handleDepartmentSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setIsSubmittingDepartment(true);
			if (editingDepartment) {
				await api.departments.update(editingDepartment.id, departmentFormData);
			} else {
				await api.departments.create(departmentFormData);
			}
			resetDepartmentForm();
			fetchData();
		} catch (error: any) {
			console.error('Error saving department:', error);
			const errorMessage = error?.response?.error || error?.message || 'Failed to save department. Please try again.';
			setErrorDialog({ open: true, message: errorMessage });
		} finally {
			setIsSubmittingDepartment(false);
		}
	};

	const handleJobDelete = async (id: string) => {
		setDeleteJobDialog({ open: true, id });
	};

	const confirmJobDelete = async () => {
		if (!deleteJobDialog.id) return;
		try {
			await api.jobPostings.delete(deleteJobDialog.id);
			if (selectedJobId === deleteJobDialog.id) {
				setSelectedJobId(null);
				setApplications([]);
			}
			fetchData();
			setDeleteJobDialog({ open: false, id: null });
		} catch (error) {
			console.error('Error deleting job posting:', error);
			setErrorDialog({ open: true, message: 'Failed to delete job posting. Please try again.' });
			setDeleteJobDialog({ open: false, id: null });
		}
	};

	const handleDepartmentDelete = async (id: string) => {
		setDeleteDepartmentDialog({ open: true, id });
	};

	const confirmDepartmentDelete = async () => {
		if (!deleteDepartmentDialog.id) return;
		try {
			await api.departments.delete(deleteDepartmentDialog.id);
			fetchData();
			setDeleteDepartmentDialog({ open: false, id: null });
		} catch (error) {
			console.error('Error deleting department:', error);
			setErrorDialog({ open: true, message: 'Failed to delete department. Please try again.' });
			setDeleteDepartmentDialog({ open: false, id: null });
		}
	};

	const handleJobEdit = (job: JobPosting) => {
		setEditingJob(job);
		setJobFormData({
			title: job.title,
			slug: job.slug,
			departmentId: job.departmentId,
			jobType: job.jobType,
			location: job.location,
			isRemote: job.isRemote,
			description: job.description || '',
			requirements: job.requirements || '',
			salaryMin: job.salaryMin,
			salaryMax: job.salaryMax,
			currency: job.currency,
			applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : '',
			applicationEmail: job.applicationEmail || '',
			isActive: job.isActive,
			isFeatured: job.isFeatured,
		});
		setIsJobModalOpen(true);
	};

	const handleDepartmentEdit = (department: Department) => {
		setEditingDepartment(department);
		setDepartmentFormData({
			name: department.name,
			description: department.description || '',
			isActive: department.isActive,
		});
		setIsDepartmentModalOpen(true);
	};

	const resetJobForm = () => {
		setJobFormData({
			title: '',
			slug: '',
			departmentId: '',
			jobType: 'full-time',
			location: '',
			isRemote: false,
			description: '',
			requirements: '',
			salaryMin: undefined,
			salaryMax: undefined,
			currency: 'INR',
			applicationDeadline: '',
			applicationEmail: '',
			isActive: true,
			isFeatured: false,
		});
		setEditingJob(null);
		setIsJobModalOpen(false);
	};

	const resetDepartmentForm = () => {
		setDepartmentFormData({
			name: '',
			description: '',
			isActive: true,
		});
		setEditingDepartment(null);
		setIsDepartmentModalOpen(false);
	};

	// Job postings are already filtered by API, so we can use them directly
	const filteredJobPostings = jobPostings;

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'reviewing':
				return 'bg-blue-100 text-blue-800';
			case 'shortlisted':
				return 'bg-green-100 text-green-800';
			case 'rejected':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
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
						Job Postings & Applications
					</h1>
					<p style={{ color: colors.gray }}>
						Manage job postings and view applicants
					</p>
				</div>
				<div className="flex gap-2">
					<Button
						variant="outline"
						onClick={() => {
							resetDepartmentForm();
							setIsDepartmentModalOpen(true);
						}}
					>
						<Building2 className="mr-2 h-4 w-4" />
						Add Department
					</Button>
					<Button
						onClick={() => {
							resetJobForm();
							setIsJobModalOpen(true);
						}}
						style={{ backgroundColor: colors.primary }}
					>
						<Plus className="mr-2 h-4 w-4" />
						Add Job Posting
					</Button>
				</div>
			</div>

			{/* Departments Section */}
			<Card>
				<CardHeader>
					<CardTitle>Departments</CardTitle>
					<CardDescription>Manage departments</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{departments.map((dept) => (
							<Card key={dept.id}>
								<CardContent className="pt-4">
									<div className="flex items-center justify-between">
										<div>
											<h3 className="font-semibold">{dept.name}</h3>
											{dept.description && (
												<p className="text-sm text-gray-600 mt-1">{dept.description}</p>
											)}
										</div>
										<div className="flex gap-2">
											<Button
												variant="ghost"
												size="icon"
												onClick={() => handleDepartmentEdit(dept)}
											>
												<Edit className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												onClick={() => handleDepartmentDelete(dept.id)}
											>
												<Trash2 className="h-4 w-4 text-red-500" />
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Job Postings Section */}
			<Card>
				<CardHeader>
					<CardTitle>Job Postings</CardTitle>
					<CardDescription>Manage job postings</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="mb-4 flex gap-4">
						<div className="flex-1">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
								<Input
									placeholder="Search job postings..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10"
								/>
							</div>
						</div>
						<select
							value={selectedDepartment}
							onChange={(e) => setSelectedDepartment(e.target.value)}
							className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
						>
							<option value="all">All Departments</option>
							{departments.map((dept) => (
								<option key={dept.id} value={dept.id}>
									{dept.name}
								</option>
							))}
						</select>
					</div>
					<>
						<div className="space-y-4">
							{filteredJobPostings.map((job) => (
								<Card
									key={job.id}
									className={selectedJobId === job.id ? 'border-blue-500' : ''}
								>
									<CardContent className="pt-4">
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-2">
													<h3 className="font-semibold text-lg">{job.title}</h3>
													{job.isFeatured && (
														<Badge style={{ backgroundColor: colors.primary }}>
															Featured
														</Badge>
													)}
													{!job.isActive && (
														<Badge variant="outline">Inactive</Badge>
													)}
												</div>
												<div className="flex gap-4 text-sm text-gray-600 mb-2">
													<span>{job.department?.name || 'No Department'}</span>
													<span>•</span>
													<span>{job.jobType}</span>
													<span>•</span>
													<span>{job.location}</span>
													{job.isRemote && <span>• Remote</span>}
												</div>
												{job.description && (
													<p className="text-sm text-gray-600 mb-2 line-clamp-2">
														{job.description}
													</p>
												)}
												<div className="flex items-center gap-4 text-sm">
													<span className="text-gray-600">
														{job._count?.applications || 0} applicants
													</span>
													<span className="text-gray-600">
														Posted: {new Date(job.postedAt).toLocaleDateString()}
													</span>
												</div>
											</div>
											<div className="flex gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => {
														setSelectedJobId(selectedJobId === job.id ? null : job.id);
														if (selectedJobId !== job.id) {
															fetchApplications(job.id);
														}
													}}
												>
													<Users className="mr-2 h-4 w-4" />
													View Applicants
												</Button>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleJobEdit(job)}
												>
													<Edit className="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleJobDelete(job.id)}
												>
													<Trash2 className="h-4 w-4 text-red-500" />
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
				</CardContent>
			</Card>

			{/* Applications Section */}
			{selectedJobId && (
				<Card>
					<CardHeader>
						<CardTitle>Applicants</CardTitle>
						<CardDescription>
							Applications for: {jobPostings.find(j => j.id === selectedJobId)?.title}
						</CardDescription>
					</CardHeader>
					<CardContent>
						{applications.length === 0 ? (
							<p className="text-center text-gray-500 py-8">No applications yet</p>
						) : (
							<div className="space-y-4">
								{applications.map((app) => (
									<Card key={app.id}>
										<CardContent className="pt-4">
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<div className="flex items-center gap-2 mb-2">
														<h3 className="font-semibold">
															{app.firstName} {app.lastName}
														</h3>
														<Badge className={getStatusColor(app.status)}>
															{app.status}
														</Badge>
													</div>
													<div className="text-sm text-gray-600">
														<p>Email: {app.email}</p>
														{app.phone && <p>Phone: {app.phone}</p>}
														<p>Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
													</div>
												</div>
												<Button
													variant="outline"
													size="sm"
													onClick={async () => {
														const newStatus = prompt('Update status (pending, reviewing, shortlisted, rejected):');
														if (newStatus) {
															try {
																await api.jobApplications.update(app.id, { status: newStatus });
																fetchApplications(selectedJobId);
															} catch (error) {
																console.error('Error updating application:', error);
																setErrorDialog({ open: true, message: 'Failed to update application status.' });
															}
														}
													}}
												>
													Update Status
												</Button>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			)}

			{/* Job Posting Modal */}
			{isJobModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle>
									{editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}
								</CardTitle>
								<Button
									variant="ghost"
									size="icon"
									onClick={resetJobForm}
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleJobSubmit} className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="jobTitle">Title *</Label>
										<Input
											id="jobTitle"
											value={jobFormData.title}
											onChange={(e) =>
												setJobFormData({ ...jobFormData, title: e.target.value })
											}
											required
										/>
									</div>
									<div>
										<Label htmlFor="jobDepartment">Department *</Label>
										<select
											id="jobDepartment"
											value={jobFormData.departmentId}
											onChange={(e) =>
												setJobFormData({ ...jobFormData, departmentId: e.target.value })
											}
											className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
											required
										>
											<option value="">Select a department</option>
											{departments.map((dept) => (
												<option key={dept.id} value={dept.id}>
													{dept.name}
												</option>
											))}
										</select>
									</div>
								</div>
								<div className="grid grid-cols-3 gap-4">
									<div>
										<Label htmlFor="jobType">Job Type *</Label>
										<select
											id="jobType"
											value={jobFormData.jobType}
											onChange={(e) =>
												setJobFormData({ ...jobFormData, jobType: e.target.value })
											}
											className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
											required
										>
											<option value="full-time">Full-time</option>
											<option value="part-time">Part-time</option>
											<option value="contract">Contract</option>
											<option value="internship">Internship</option>
										</select>
									</div>
									<div>
										<Label htmlFor="jobLocation">Location *</Label>
										<Input
											id="jobLocation"
											value={jobFormData.location}
											onChange={(e) =>
												setJobFormData({ ...jobFormData, location: e.target.value })
											}
											required
										/>
									</div>
									<div className="flex items-end">
										<label className="flex items-center gap-2">
											<input
												type="checkbox"
												checked={jobFormData.isRemote}
												onChange={(e) =>
													setJobFormData({ ...jobFormData, isRemote: e.target.checked })
												}
											/>
											<span className="text-sm">Remote</span>
										</label>
									</div>
								</div>
								<div>
									<Label htmlFor="jobDescription">Description</Label>
									<Textarea
										id="jobDescription"
										value={jobFormData.description}
										onChange={(e) =>
											setJobFormData({ ...jobFormData, description: e.target.value })
										}
										rows={4}
									/>
								</div>
								<div>
									<Label htmlFor="jobRequirements">Requirements</Label>
									<Textarea
										id="jobRequirements"
										value={jobFormData.requirements}
										onChange={(e) =>
											setJobFormData({ ...jobFormData, requirements: e.target.value })
										}
										rows={4}
									/>
								</div>
								<div className="grid grid-cols-4 gap-4">
									<div>
										<Label htmlFor="salaryMin">Min Salary</Label>
										<Input
											id="salaryMin"
											type="number"
											value={jobFormData.salaryMin || ''}
											onChange={(e) =>
												setJobFormData({ ...jobFormData, salaryMin: parseFloat(e.target.value) || undefined })
											}
										/>
									</div>
									<div>
										<Label htmlFor="salaryMax">Max Salary</Label>
										<Input
											id="salaryMax"
											type="number"
											value={jobFormData.salaryMax || ''}
											onChange={(e) =>
												setJobFormData({ ...jobFormData, salaryMax: parseFloat(e.target.value) || undefined })
											}
										/>
									</div>
									<div>
										<Label htmlFor="currency">Currency</Label>
										<select
											id="currency"
											value={jobFormData.currency}
											onChange={(e) =>
												setJobFormData({ ...jobFormData, currency: e.target.value })
											}
											className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
										>
											<option value="INR">INR</option>
											<option value="USD">USD</option>
											<option value="EUR">EUR</option>
										</select>
									</div>
									<div>
										<Label htmlFor="applicationDeadline">Deadline</Label>
										<Input
											id="applicationDeadline"
											type="date"
											value={jobFormData.applicationDeadline}
											onChange={(e) =>
												setJobFormData({ ...jobFormData, applicationDeadline: e.target.value })
											}
										/>
									</div>
								</div>
								<div>
									<Label htmlFor="applicationEmail">Application Email</Label>
									<Input
										id="applicationEmail"
										type="email"
										value={jobFormData.applicationEmail}
										onChange={(e) =>
											setJobFormData({ ...jobFormData, applicationEmail: e.target.value })
										}
									/>
								</div>
								<div className="flex gap-4">
									<label className="flex items-center gap-2">
										<input
											type="checkbox"
											checked={jobFormData.isActive}
											onChange={(e) =>
												setJobFormData({ ...jobFormData, isActive: e.target.checked })
											}
										/>
										<span className="text-sm">Active</span>
									</label>
									<label className="flex items-center gap-2">
										<input
											type="checkbox"
											checked={jobFormData.isFeatured}
											onChange={(e) =>
												setJobFormData({ ...jobFormData, isFeatured: e.target.checked })
											}
										/>
										<span className="text-sm">Featured</span>
									</label>
								</div>
								<div className="flex justify-end gap-2 pt-4">
									<Button
										type="button"
										variant="outline"
										onClick={resetJobForm}
									>
										Cancel
									</Button>
									<Button
										type="submit"
										style={{ backgroundColor: colors.primary }}
										disabled={isSubmittingJob}
									>
										{isSubmittingJob ? (
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										) : (
											<Save className="mr-2 h-4 w-4" />
										)}
										{editingJob ? 'Update' : 'Create'}
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Department Modal */}
			{isDepartmentModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<Card className="w-full max-w-md">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle>
									{editingDepartment ? 'Edit Department' : 'Create New Department'}
								</CardTitle>
								<Button
									variant="ghost"
									size="icon"
									onClick={resetDepartmentForm}
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleDepartmentSubmit} className="space-y-4">
								<div>
									<Label htmlFor="deptName">Name *</Label>
									<Input
										id="deptName"
										value={departmentFormData.name}
										onChange={(e) =>
											setDepartmentFormData({ ...departmentFormData, name: e.target.value })
										}
										required
									/>
								</div>
								<div>
									<Label htmlFor="deptDescription">Description</Label>
									<Textarea
										id="deptDescription"
										value={departmentFormData.description}
										onChange={(e) =>
											setDepartmentFormData({ ...departmentFormData, description: e.target.value })
										}
										rows={3}
									/>
								</div>
								<div className="flex items-center gap-2">
									<input
										type="checkbox"
										id="deptActive"
										checked={departmentFormData.isActive}
										onChange={(e) =>
											setDepartmentFormData({ ...departmentFormData, isActive: e.target.checked })
										}
									/>
									<Label htmlFor="deptActive">Active</Label>
								</div>
								<div className="flex justify-end gap-2 pt-4">
									<Button
										type="button"
										variant="outline"
										onClick={resetDepartmentForm}
									>
										Cancel
									</Button>
									<Button
										type="submit"
										style={{ backgroundColor: colors.primary }}
										disabled={isSubmittingDepartment}
									>
										{isSubmittingDepartment ? (
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										) : (
											<Save className="mr-2 h-4 w-4" />
										)}
										{editingDepartment ? 'Update' : 'Create'}
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Error Dialog */}
			<Dialog open={errorDialog.open} onOpenChange={(open) => setErrorDialog({ open, message: '' })}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Error</DialogTitle>
						<DialogDescription>{errorDialog.message}</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>

			{/* Delete Job Confirmation Dialog */}
			<AlertDialog open={deleteJobDialog.open} onOpenChange={(open) => setDeleteJobDialog({ open, id: null })}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the job posting.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={confirmJobDelete}>Delete</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Delete Department Confirmation Dialog */}
			<AlertDialog open={deleteDepartmentDialog.open} onOpenChange={(open) => setDeleteDepartmentDialog({ open, id: null })}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the department.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={confirmDepartmentDelete}>Delete</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};
