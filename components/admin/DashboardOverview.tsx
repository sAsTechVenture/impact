'use client';
import React, {
	useEffect,
	useState,
} from 'react';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import {
	Calendar,
	Briefcase,
	ShoppingBag,
	FileText,
	Users,
	TrendingUp,
} from 'lucide-react';
import { colors } from '@/config/theme';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { api } from '@/utils/api';

export const DashboardOverview: React.FC<{
	isLoading: boolean;
}> = ({ isLoading }) => {
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState<{
		events: number;
		upcomingEvents: number;
		services: number;
		activeServices: number;
		products: number;
		activeProducts: number;
		jobApplications: number;
		pendingApplications: number;
		employees: number;
		recentEvents: Array<{
			id?: string;
			title?: string;
			startDate?: string;
			status?: string;
		}>;
		recentServices: Array<{
			id?: string;
			name?: string;
			status?: string;
		}>;
		recentProducts: Array<{
			id?: string;
			name?: string;
			status?: string;
		}>;
		recentApplications: Array<{
			id?: string;
			firstName?: string;
			lastName?: string;
			email?: string;
			status?: string;
			appliedAt?: string;
		}>;
	}>({
		events: 0,
		upcomingEvents: 0,
		services: 0,
		activeServices: 0,
		products: 0,
		activeProducts: 0,
		jobApplications: 0,
		pendingApplications: 0,
		employees: 0,
		recentEvents: [],
		recentServices: [],
		recentProducts: [],
		recentApplications: [],
	});

	useEffect(() => {
		async function fetchData() {
			try {
				const [
					eventsRes,
					servicesRes,
					productsRes,
					applicationsRes,
					employeesRes,
				] = await Promise.all([
					api.events.list(1, 100),
					api.services.list(1, 100),
					api.products.list(1, 100),
					api.jobApplications.list(1, 100),
					api.employees.list(1, 100),
				]);

				const events = Array.isArray(eventsRes?.data) ? eventsRes.data : [];
				const services = Array.isArray(servicesRes?.data) ? servicesRes.data : [];
				const products = Array.isArray(productsRes?.data) ? productsRes.data : [];
				const applications = Array.isArray(applicationsRes?.data) ? applicationsRes.data : [];
				const employees = Array.isArray(employeesRes?.data) ? employeesRes.data : [];

				// Calculate upcoming events
				const now = new Date();
				const upcomingEvents = events.filter((event: any) => {
					if (!event.startDate) return false;
					const startDate = new Date(event.startDate);
					return startDate >= now && event.status !== 'cancelled';
				});

				// Calculate active services and products
				const activeServices = services.filter((s: any) => s.status === 'active');
				const activeProducts = products.filter((p: any) => p.status === 'active');
				const pendingApplications = applications.filter((a: any) => a.status === 'pending');

				// Sort and get recent items
				const sortedEvents = [...events]
					.sort((a: any, b: any) => {
						const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
						const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
						return dateB - dateA;
					})
					.slice(0, 3);

				const sortedServices = [...services]
					.sort((a: any, b: any) => {
						const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
						const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
						return dateB - dateA;
					})
					.slice(0, 3);

				const sortedProducts = [...products]
					.sort((a: any, b: any) => {
						const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
						const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
						return dateB - dateA;
					})
					.slice(0, 3);

				const sortedApplications = [...applications]
					.sort((a: any, b: any) => {
						const dateA = a.appliedAt ? new Date(a.appliedAt).getTime() : 0;
						const dateB = b.appliedAt ? new Date(b.appliedAt).getTime() : 0;
						return dateB - dateA;
					})
					.slice(0, 3);

				setStats({
					events: events.length,
					upcomingEvents: upcomingEvents.length,
					services: services.length,
					activeServices: activeServices.length,
					products: products.length,
					activeProducts: activeProducts.length,
					jobApplications: applications.length,
					pendingApplications: pendingApplications.length,
					employees: employees.length,
					recentEvents: sortedEvents,
					recentServices: sortedServices,
					recentProducts: sortedProducts,
					recentApplications: sortedApplications,
				});
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, []);

	const statCards = [
		{
			title: 'Total Events',
			value: stats.events,
			icon: Calendar,
			color: colors.primary,
			subtitle: `${stats.upcomingEvents} upcoming`,
		},
		{
			title: 'Total Services',
			value: stats.services,
			icon: Briefcase,
			color: colors.primary,
			subtitle: `${stats.activeServices} active`,
		},
		{
			title: 'Total Products',
			value: stats.products,
			icon: ShoppingBag,
			color: colors.primary,
			subtitle: `${stats.activeProducts} active`,
		},
		{
			title: 'Job Applications',
			value: stats.jobApplications,
			icon: FileText,
			color: colors.primary,
			subtitle: `${stats.pendingApplications} pending`,
		},
		{
			title: 'Employees',
			value: stats.employees,
			icon: Users,
			color: colors.primary,
		},
		{
			title: 'Active Services',
			value: stats.activeServices,
			icon: TrendingUp,
			color: colors.green,
		},
	];

	if (isLoading || loading) {
		return (
			<div className="space-y-6">
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
					{[1, 2, 3, 4, 5, 6].map(i => (
						<Card key={i}>
							<CardContent className="p-6">
								<Skeleton className="mb-2 h-4 w-24" />
								<Skeleton className="mb-2 h-8 w-16" />
								<Skeleton className="h-4 w-12" />
							</CardContent>
						</Card>
					))}
				</div>
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					{[1, 2, 3, 4].map(i => (
						<Card key={i}>
							<CardContent className="pt-6">
								<Skeleton className="h-6 w-1/3 mb-4" />
								<Skeleton className="h-20 w-full" />
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1
					className="text-3xl font-bold"
					style={{ color: colors.textPrimary }}
				>
					Dashboard Overview
				</h1>
				<p
					style={{ color: colors.gray }}
				>
					Welcome back! Here&apos;s what&apos;s happening
					with your business today.
				</p>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
				{statCards.map((stat, index) => {
					const Icon = stat.icon;
					return (
						<Card
							key={index}
							className="transition-shadow duration-200 hover:shadow-lg"
						>
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<p
											className="text-sm font-medium"
											style={{
												color: colors.gray,
											}}
										>
											{stat.title}
										</p>
										<p
											className="text-3xl font-bold"
											style={{
												color: colors.textPrimary,
											}}
										>
											{stat.value}
										</p>
										{stat.subtitle && (
											<p
												className="text-xs mt-1"
												style={{
													color: colors.gray,
												}}
											>
												{stat.subtitle}
											</p>
										)}
									</div>
									<div
										className="rounded-full p-3"
										style={{
											backgroundColor: `${stat.color}20`,
										}}
									>
										<Icon
											className="h-6 w-6"
											style={{
												color: stat.color,
											}}
										/>
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Recent Data */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Recent Events</CardTitle>
						<CardDescription>
							Latest events and activities
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{stats.recentEvents.length > 0 ? (
								stats.recentEvents.map((event: any, i: number) => (
									<div
										key={event.id || i}
										className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
									>
										<div className="flex-1">
											<p
												className="font-medium"
												style={{
													color: colors.textPrimary,
												}}
											>
												{event.title || 'Untitled Event'}
											</p>
											<p
												className="text-sm"
												style={{
													color: colors.gray,
												}}
											>
												{event.startDate
													? new Date(event.startDate).toLocaleDateString()
													: 'No date'}
											</p>
										</div>
										<Badge
											variant={
												event.status === 'upcoming'
													? 'default'
													: 'outline'
											}
										>
											{event.status || 'upcoming'}
										</Badge>
									</div>
								))
							) : (
								<p className="text-sm text-gray-500">
									No events yet.
								</p>
							)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Recent Services</CardTitle>
						<CardDescription>
							Latest added services
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{stats.recentServices.length > 0 ? (
								stats.recentServices.map((service: any, i: number) => (
									<div
										key={service.id || i}
										className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
									>
										<span
											style={{
												color: colors.textPrimary,
											}}
										>
											{service.name || 'Unnamed Service'}
										</span>
										<Badge
											className={
												service.status === 'active'
													? 'bg-green-100 text-green-800'
													: 'bg-gray-100 text-gray-800'
											}
										>
											{service.status || 'inactive'}
										</Badge>
									</div>
								))
							) : (
								<p className="text-sm text-gray-500">
									No services yet.
								</p>
							)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Recent Products</CardTitle>
						<CardDescription>
							Latest added products
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{stats.recentProducts.length > 0 ? (
								stats.recentProducts.map((product: any, i: number) => (
									<div
										key={product.id || i}
										className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
									>
										<span
											style={{
												color: colors.textPrimary,
											}}
										>
											{product.name || 'Unnamed Product'}
										</span>
										<Badge
											className={
												product.status === 'active'
													? 'bg-green-100 text-green-800'
													: product.status === 'out_of_stock'
														? 'bg-red-100 text-red-800'
														: 'bg-gray-100 text-gray-800'
											}
										>
											{product.status?.replace('_', ' ') || 'inactive'}
										</Badge>
									</div>
								))
							) : (
								<p className="text-sm text-gray-500">
									No products yet.
								</p>
							)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Recent Job Applications</CardTitle>
						<CardDescription>
							Latest job applications
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{stats.recentApplications.length > 0 ? (
								stats.recentApplications.map((app: any, i: number) => (
									<div
										key={app.id || i}
										className="flex items-center space-x-4 rounded-lg bg-gray-50 p-3"
									>
										<div className="bg-primary-100 flex h-10 w-10 items-center justify-center rounded-full">
											<Users
												className="h-5 w-5"
												style={{
													color: colors.primary,
												}}
											/>
										</div>
										<div className="flex-1">
											<p
												className="font-medium"
												style={{
													color: colors.textPrimary,
												}}
											>
												{app.firstName && app.lastName
													? `${app.firstName} ${app.lastName}`
													: app.email || 'Unknown'}
											</p>
											<p
												className="text-sm"
												style={{
													color: colors.gray,
												}}
											>
												{app.email || 'No email'}
											</p>
										</div>
										<Badge
											className={
												app.status === 'pending'
													? 'bg-yellow-100 text-yellow-800'
													: app.status === 'accepted'
														? 'bg-green-100 text-green-800'
														: app.status === 'rejected'
															? 'bg-red-100 text-red-800'
															: 'bg-gray-100 text-gray-800'
											}
										>
											{app.status || 'pending'}
										</Badge>
									</div>
								))
							) : (
								<p className="text-sm text-gray-500">
									No job applications yet.
								</p>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};