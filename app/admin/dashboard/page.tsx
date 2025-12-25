'use client';
import React, {
	useState,
	useEffect,
} from 'react';
import {
	Menu,
} from 'lucide-react';
import { colors } from '@/config/theme';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';

import {
	Sidebar,
	DashboardOverview,
	EventsManagement,
	ServicesManagement,
	ProductsManagement,
	LifeCareerManagement,
	EmployeesManagement,
} from '@/components/admin';
// import { ToastProvider } from '@/components/common/ToastProvider';

export default function AdminDashboard() {
	const { user, logout } = useAuth();
	const [activeTab, setActiveTab] =
		useState('dashboard');
	const [sidebarOpen, setSidebarOpen] =
		useState(false);
	const [isLoading, setIsLoading] =
		useState(true);

	useEffect(() => {
		const timer = setTimeout(
			() => setIsLoading(false),
			1500
		);
		return () => clearTimeout(timer);
	}, [activeTab]);

	const renderContent = () => {
		switch (activeTab) {
			case 'dashboard':
				return (
					<DashboardOverview
						isLoading={isLoading}
					/>
				);
			case 'events':
				return <EventsManagement />;
			case 'services':
				return <ServicesManagement />;
			case 'products':
				return <ProductsManagement />;
			case 'life_career':
				return <LifeCareerManagement />;
			case 'employees':
				return <EmployeesManagement />;
			default:
				return (
					<div className="space-y-4">
						<Skeleton className="h-6 w-1/3" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4" />
					</div>
				);
		}
	};

	return (
		<>
			{/* <ToastProvider /> */}
			<div className="flex h-screen bg-gray-50">
				{/* Sidebar for desktop */}
				<div className="hidden w-64 lg:block">
					<Sidebar
						activeTab={activeTab}
						setActiveTab={setActiveTab}
						isOpen={true}
						setIsOpen={setSidebarOpen}
					/>
				</div>
				{/* Sidebar for mobile (always rendered for animation) */}
				<div className="lg:hidden">
					<Sidebar
						activeTab={activeTab}
						setActiveTab={setActiveTab}
						isOpen={sidebarOpen}
						setIsOpen={setSidebarOpen}
					/>
				</div>

				{/* Main Content */}
				<div className="flex flex-1 flex-col h-screen overflow-hidden">
					{/* Top Bar */}
					<header
						className="flex h-16 items-center justify-between border-b px-4 lg:px-8 flex-shrink-0"
						style={{
							backgroundColor: colors.white,
							borderColor: colors.primary,
						}}
					>
						<div className="flex items-center space-x-4">
							<Button
								variant="ghost"
								size="sm"
								className="lg:hidden"
								onClick={() => setSidebarOpen(true)}
							>
								<Menu className="h-5 w-5" />
							</Button>
							<div>
								<h1
									className="text-lg font-semibold capitalize"
									style={{
										color: colors.textPrimary,
									}}
								>
									{activeTab === 'dashboard'
										? 'Dashboard'
										: activeTab === 'pricing'
											? 'Pricing Cards'
											: activeTab === 'enquiries'
												? 'Enquiries'
												: activeTab === 'meals'
													? 'Meals'
													: activeTab === 'blogs'
														? 'Blogs'
														: activeTab === 'faq'
															? 'FAQ Management'
															: activeTab === 'pricing_rules'
																? 'Pricing Rules'
																: activeTab === 'events'
																	? 'Events Management'
																	: activeTab === 'services'
																		? 'Services Management'
																		: activeTab === 'products'
																			? 'Products Management'
																			: activeTab === 'life_career'
																				? 'Life & Career Page'
																				: activeTab === 'employees'
																					? 'Employees Management'
																					: 'Dashboard'}
								</h1>
								<p
									className="text-sm"
									style={{
										color: colors.gray,
									}}
								>
									{new Date().toLocaleDateString(
										'en-US',
										{
											weekday: 'long',
											year: 'numeric',
											month: 'long',
											day: 'numeric',
										}
									)}
								</p>
							</div>
						</div>

						<div className="flex items-center space-x-4">
							<div className="flex items-center space-x-2">
								<Button
									variant="destructive"
									size="sm"
									onClick={logout}
									className="ml-2"
								>
									Logout
								</Button>
							</div>
							<div className="flex items-center space-x-2">
								<div
									className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white"
									style={{
										backgroundColor: colors.primary,
									}}
								>
									A
								</div>
								<div className="hidden sm:block">
									<p
										className="text-sm font-medium"
										style={{
											color: colors.textPrimary,
										}}
									>
										Admin
									</p>
									<p
										className="text-xs"
										style={{
											color: colors.gray,
										}}
									>
										{user?.email}
									</p>
								</div>
							</div>
						</div>
					</header>

					{/* Page Content */}
					<main className="flex-1 overflow-y-auto p-4 lg:p-8 min-h-0">
						{renderContent()}
					</main>
				</div>
			</div>
		</>
	);
}