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
import { ImageUpload } from '@/components/ui/image-upload';
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
	Users,
	Plus,
	Edit,
	Trash2,
	Search,
	X,
	Save,
	ChevronRight,
	ChevronDown,
	User,
	Loader2,
} from 'lucide-react';
import { api } from '@/utils/api';

interface Employee {
	id: string;
	firstName: string;
	lastName: string;
	name?: string; // Computed: firstName + lastName
	email?: string;
	designation: string;
	position?: string; // Alias for designation
	department?: string;
	phone?: string;
	managerId?: string;
	manager?: Employee;
	reports?: Employee[];
	subordinates?: Employee[]; // Alias for reports
	isActive: boolean;
	status?: 'active' | 'inactive'; // Computed from isActive
	joinedAt?: string;
	hireDate?: string; // Alias for joinedAt
	createdAt?: string;
	updatedAt?: string;
}

export const EmployeesManagement: React.FC = () => {
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
	const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);
	const ITEMS_PER_PAGE = 5;
	const [formData, setFormData] = useState<Partial<Employee>>({
		name: '',
		email: '',
		position: '',
		department: '',
		phone: '',
		managerId: '',
		status: 'active',
		hireDate: '',
		imageUrl: '',
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorDialog, setErrorDialog] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
	const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });

	useEffect(() => {
		fetchEmployees();
	}, [currentPage, searchTerm]);

	const fetchEmployees = async () => {
		try {
			setLoading(true);
			const response = await api.employees.list(currentPage, ITEMS_PER_PAGE, searchTerm);
			const employeesList = (response.data || []).map((emp: any) => ({
				...emp,
				name: `${emp.firstName} ${emp.lastName}`,
				position: emp.designation,
				status: emp.isActive ? 'active' : 'inactive',
				hireDate: emp.joinedAt,
				subordinates: emp.reports || [],
			}));
			// Build tree structure
			const tree = buildEmployeeTree(employeesList);
			setEmployees(tree);
			setTotalPages(response.totalPages || 1);
			setTotal(response.total || 0);
		} catch (error) {
			console.error('Error fetching employees:', error);
		} finally {
			setLoading(false);
		}
	};

	const buildEmployeeTree = (employeesList: Employee[]): Employee[] => {
		const employeeMap = new Map<string, Employee>();
		const rootEmployees: Employee[] = [];

		// First pass: create map of all employees
		employeesList.forEach(emp => {
			employeeMap.set(emp.id, { ...emp, subordinates: [] });
		});

		// Second pass: build tree structure
		employeesList.forEach(emp => {
			const employee = employeeMap.get(emp.id)!;
			if (emp.managerId && employeeMap.has(emp.managerId)) {
				const manager = employeeMap.get(emp.managerId)!;
				if (!manager.subordinates) {
					manager.subordinates = [];
				}
				manager.subordinates.push(employee);
			} else {
				rootEmployees.push(employee);
			}
		});

		return rootEmployees;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setIsSubmitting(true);
			// Map form data to API structure
			const nameParts = (formData.name || '').trim().split(/\s+/).filter(part => part.length > 0);
			if (nameParts.length === 0) {
				setErrorDialog({ open: true, message: 'Name is required' });
				setIsSubmitting(false);
				return;
			}
			const firstName = nameParts[0];
			const lastName = nameParts.slice(1).join(' ') || nameParts[0]; // Use first name as last name if only one word
			
			if (!formData.position || !formData.position.trim()) {
				setErrorDialog({ open: true, message: 'Position/Designation is required' });
				setIsSubmitting(false);
				return;
			}

			const apiData: any = {
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				email: formData.email?.trim() || undefined,
				phone: formData.phone?.trim() || undefined,
				designation: formData.position.trim(),
				department: formData.department?.trim() || undefined,
				imageUrl: formData.imageUrl?.trim() || undefined,
				managerId: formData.managerId || undefined,
				isActive: formData.status === 'active',
				joinedAt: formData.hireDate || undefined,
			};

			console.log('Submitting employee data:', apiData);

			if (editingEmployee) {
				await api.employees.update(editingEmployee.id, apiData);
			} else {
				await api.employees.create(apiData);
			}
			resetForm();
			fetchEmployees();
		} catch (error: any) {
			console.error('Error saving employee:', error);
			const errorMessage = error?.response?.error || error?.message || 'Failed to save employee. Please try again.';
			setErrorDialog({ open: true, message: errorMessage });
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async (id: string) => {
		setDeleteDialog({ open: true, id });
	};

	const confirmDelete = async () => {
		if (!deleteDialog.id) return;
		try {
			await api.employees.delete(deleteDialog.id);
			fetchEmployees();
			setDeleteDialog({ open: false, id: null });
		} catch (error) {
			console.error('Error deleting employee:', error);
			setErrorDialog({ open: true, message: 'Failed to delete employee. Please try again.' });
			setDeleteDialog({ open: false, id: null });
		}
	};

	const handleEdit = (employee: Employee) => {
		setEditingEmployee(employee);
		setFormData({
			name: employee.name || `${employee.firstName} ${employee.lastName}`,
			email: employee.email || '',
			position: employee.position || employee.designation || '',
			department: employee.department || '',
			phone: employee.phone || '',
			managerId: employee.managerId || '',
			status: employee.status || (employee.isActive ? 'active' : 'inactive'),
			hireDate: employee.hireDate ? employee.hireDate.split('T')[0] : (employee.joinedAt ? employee.joinedAt.split('T')[0] : ''),
			imageUrl: employee.imageUrl || '',
		});
		setIsModalOpen(true);
	};

	const resetForm = () => {
		setFormData({
			name: '',
			email: '',
			position: '',
			department: '',
			phone: '',
			managerId: '',
			status: 'active',
			hireDate: '',
			imageUrl: '',
		});
		setEditingEmployee(null);
		setIsModalOpen(false);
	};

	const toggleNode = (id: string) => {
		const newExpanded = new Set(expandedNodes);
		if (newExpanded.has(id)) {
			newExpanded.delete(id);
		} else {
			newExpanded.add(id);
		}
		setExpandedNodes(newExpanded);
	};

	const getAllEmployees = (employeesList: Employee[]): Employee[] => {
		const result: Employee[] = [];
		const traverse = (emps: Employee[]) => {
			emps.forEach(emp => {
				result.push(emp);
				if (emp.subordinates && emp.subordinates.length > 0) {
					traverse(emp.subordinates);
				}
			});
		};
		traverse(employeesList);
		return result;
	};

	// Reset to page 1 when search term changes
	useEffect(() => {
		if (searchTerm !== '') {
			setCurrentPage(1);
		}
	}, [searchTerm]);

	const filteredEmployees = getAllEmployees(employees).filter(emp =>
		emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
		emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
		emp.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
		emp.department?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const renderEmployeeNode = (employee: Employee, level: number = 0): React.ReactNode => {
		const hasChildren = employee.subordinates && employee.subordinates.length > 0;
		const isExpanded = expandedNodes.has(employee.id);
		const indent = level * 24;

		return (
			<div key={employee.id}>
				<div
					className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
					style={{ paddingLeft: `${indent + 12}px` }}
				>
					{hasChildren ? (
						<button
							onClick={() => toggleNode(employee.id)}
							className="p-1 hover:bg-gray-200 rounded"
						>
							{isExpanded ? (
								<ChevronDown className="h-4 w-4" />
							) : (
								<ChevronRight className="h-4 w-4" />
							)}
						</button>
					) : (
						<div className="w-6" />
					)}
					<div className="flex-1 flex items-center justify-between">
						<div className="flex items-center gap-3 flex-1">
							<User className="h-5 w-5" style={{ color: colors.primary }} />
							<div className="flex-1">
								<div className="flex items-center gap-2">
									<h3
										className="font-semibold"
										style={{ color: colors.textPrimary }}
									>
										{employee.name}
									</h3>
									<Badge className={employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
										{employee.status}
									</Badge>
								</div>
								<div className="text-sm" style={{ color: colors.gray }}>
									{employee.position}
									{employee.department && ` • ${employee.department}`}
								</div>
								<div className="text-xs" style={{ color: colors.gray }}>
									{employee.email}
									{employee.phone && ` • ${employee.phone}`}
								</div>
							</div>
						</div>
						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleEdit(employee)}
							>
								<Edit className="h-4 w-4" />
							</Button>
							<Button
								variant="destructive"
								size="sm"
								onClick={() => handleDelete(employee.id)}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
				{hasChildren && isExpanded && (
					<div>
						{employee.subordinates!.map(sub => renderEmployeeNode(sub, level + 1))}
					</div>
				)}
			</div>
		);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1
						className="text-3xl font-bold"
						style={{ color: colors.textPrimary }}
					>
						Employees Management
					</h1>
					<p style={{ color: colors.gray }}>
						Manage employees and organizational structure
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
					Add Employee
				</Button>
			</div>

			{/* Search */}
			<Card>
				<CardContent className="pt-6">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
						<Input
							placeholder="Search employees by name, email, position, or department..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
				</CardContent>
			</Card>

			{/* Employee Tree */}
			<Card>
				<CardHeader>
					<CardTitle>Organizational Structure</CardTitle>
					<CardDescription>
						View and manage the employee hierarchy
					</CardDescription>
				</CardHeader>
				<CardContent>
					{loading ? (
						<div className="space-y-4">
							{[1, 2, 3, 4].map((i) => (
								<Skeleton key={i} className="h-20 w-full" />
							))}
						</div>
					) : employees.length === 0 ? (
						<div className="text-center py-12">
							<Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
							<p style={{ color: colors.gray }}>
								No employees found. Create your first employee!
							</p>
						</div>
					) : searchTerm ? (
						<div className="space-y-2">
							{filteredEmployees.map((employee) => (
								<div
									key={employee.id}
									className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
								>
									<div className="flex items-center gap-3 flex-1">
										<User className="h-5 w-5" style={{ color: colors.primary }} />
										<div>
											<div className="flex items-center gap-2">
												<h3
													className="font-semibold"
													style={{ color: colors.textPrimary }}
												>
													{employee.name}
												</h3>
												<Badge className={employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
													{employee.status}
												</Badge>
											</div>
											<div className="text-sm" style={{ color: colors.gray }}>
												{employee.position}
												{employee.department && ` • ${employee.department}`}
											</div>
											<div className="text-xs" style={{ color: colors.gray }}>
												{employee.email}
											</div>
										</div>
									</div>
									<div className="flex gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleEdit(employee)}
										>
											<Edit className="h-4 w-4" />
										</Button>
										<Button
											variant="destructive"
											size="sm"
											onClick={() => handleDelete(employee.id)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</div>
							))}
						</div>
					) : (
						<>
							<div className="space-y-1">
								{employees.map(employee => renderEmployeeNode(employee))}
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
				</CardContent>
			</Card>

			{/* Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle>
									{editingEmployee ? 'Edit Employee' : 'Create New Employee'}
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
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="name">Name *</Label>
										<Input
											id="name"
											value={formData.name}
											onChange={(e) =>
												setFormData({ ...formData, name: e.target.value })
											}
											required
										/>
									</div>
									<div>
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											type="email"
											value={formData.email}
											onChange={(e) =>
												setFormData({ ...formData, email: e.target.value })
											}
										/>
									</div>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="position">Position *</Label>
										<Input
											id="position"
											value={formData.position}
											onChange={(e) =>
												setFormData({ ...formData, position: e.target.value })
											}
											required
										/>
									</div>
									<div>
										<Label htmlFor="department">Department</Label>
										<Input
											id="department"
											value={formData.department}
											onChange={(e) =>
												setFormData({ ...formData, department: e.target.value })
											}
										/>
									</div>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="phone">Phone</Label>
										<Input
											id="phone"
											type="tel"
											value={formData.phone}
											onChange={(e) =>
												setFormData({ ...formData, phone: e.target.value })
											}
										/>
									</div>
								<div>
									<Label htmlFor="hireDate">Hire Date</Label>
									<Input
										id="hireDate"
										type="date"
										value={formData.hireDate}
										onChange={(e) =>
											setFormData({ ...formData, hireDate: e.target.value })
										}
									/>
								</div>
							</div>
							<div>
								<ImageUpload
									value={formData.imageUrl}
									onChange={(url) => setFormData({ ...formData, imageUrl: url })}
									folder="employees"
									label="Employee Image"
								/>
							</div>
							<div>
								<Label htmlFor="managerId">Manager</Label>
									<select
										id="managerId"
										value={formData.managerId}
										onChange={(e) =>
											setFormData({ ...formData, managerId: e.target.value || undefined })
										}
										className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
									>
										<option value="">No Manager (Top Level)</option>
										{getAllEmployees(employees)
											.filter(emp => !editingEmployee || emp.id !== editingEmployee.id)
											.map((emp) => (
												<option key={emp.id} value={emp.id}>
													{emp.name} - {emp.position}
												</option>
											))}
									</select>
								</div>
								<div>
									<Label htmlFor="status">Status *</Label>
									<select
										id="status"
										value={formData.status}
										onChange={(e) =>
											setFormData({
												...formData,
												status: e.target.value as Employee['status'],
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
										onClick={resetForm}
									>
										Cancel
									</Button>
									<Button
										type="submit"
										style={{ backgroundColor: colors.primary }}
										disabled={isSubmitting}
									>
										{isSubmitting ? (
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										) : (
											<Save className="mr-2 h-4 w-4" />
										)}
										{editingEmployee ? 'Update' : 'Create'}
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

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, id: null })}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the employee.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

