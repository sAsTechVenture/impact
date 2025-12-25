import {
	LayoutDashboard,
	CreditCard,
	MessageSquare,
	UtensilsCrossed,
	HelpCircle,
	X,
	AlertTriangle,
	Calendar,
	Briefcase,
	ShoppingBag,
	FileText,
	Users,
} from 'lucide-react';
import { colors } from '@/config/theme';
import { Button } from '@/components/ui/button';

export const Sidebar: React.FC<{
	activeTab: string;
	setActiveTab: (tab: string) => void;
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
}> = ({
	activeTab,
	setActiveTab,
	isOpen,
	setIsOpen,
}) => {
	const menuItems = [
		{
			id: 'dashboard',
			label: 'Dashboard',
			icon: LayoutDashboard,
		},
		{ id: 'events', label: 'Events', icon: Calendar },
		{ id: 'services', label: 'Services', icon: Briefcase },
		{ id: 'products', label: 'Products', icon: ShoppingBag },
		{ id: 'life_career', label: 'Life & Career', icon: FileText },
		{ id: 'employees', label: 'Employees', icon: Users },
	];

	return (
		<>
			{/* Mobile Overlay */}
			<div
				className={`fixed inset-0 z-40 transition-opacity duration-300 lg:hidden ${
					isOpen
						? 'pointer-events-auto bg-black/20 opacity-100 backdrop-blur-sm'
						: 'pointer-events-none opacity-0'
				}`}
				onClick={() => setIsOpen(false)}
			/>

			{/* Sidebar */}
			<aside
				className={`fixed top-0 left-0 z-50 h-screen w-64 transform transition-transform duration-300 ease-in-out lg:static lg:h-screen lg:translate-x-0 ${
					isOpen
						? 'translate-x-0'
						: '-translate-x-full'
				}`}
				style={{
					backgroundColor: colors.primary,
				}}
			>
				<div className="flex h-full flex-col">
					{/* Header */}
					<div className="border-opacity-20 flex h-16 items-center justify-between border-b border-white px-6">
						<h2 className="text-xl font-bold text-white">
							Admin Panel
						</h2>
						<Button
							variant="ghost"
							size="sm"
							className="text-white lg:hidden"
							onClick={() => setIsOpen(false)}
						>
							<X className="h-5 w-5" />
						</Button>
					</div>

					{/* Navigation */}
					<nav className="flex-1 space-y-2 p-4">
						{menuItems.map(item => {
							const IconComponent = item.icon;
							return (
								<button
									key={item.id}
									onClick={() => {
										setActiveTab(item.id);
										setIsOpen(false);
									}}
									className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left transition-colors duration-200 ${
										activeTab === item.id
											? 'bg-opacity-20 bg-white text-black'
											: 'text-opacity-80 hover:bg-opacity-10 text-white hover:bg-white hover:text-black'
									}`}
								>
									<IconComponent className="h-5 w-5" />
									<span className="font-medium">
										{item.label}
									</span>
								</button>
							);
						})}
					</nav>

					{/* Footer */}
					<div className="border-opacity-20 border-t border-white p-4">
						<div className="text-opacity-60 text-sm text-white">
							© 2025 Admin Dashboard
						</div>
					</div>
				</div>
			</aside>
		</>
	);
};