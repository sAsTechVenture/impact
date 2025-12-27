'use client';
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { colors } from '@/config/theme';

interface ImageUploadProps {
	value?: string;
	onChange: (url: string) => void;
	folder: 'products' | 'services' | 'events' | 'employees';
	label?: string;
	required?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
	value,
	onChange,
	folder,
	label = 'Image',
	required = false,
}) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file
		const maxSize = 5 * 1024 * 1024; // 5MB
		const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

		if (file.size > maxSize) {
			setError('Image size must be less than 5MB');
			return;
		}

		if (!allowedTypes.includes(file.type)) {
			setError('Invalid image type. Allowed: JPEG, PNG, GIF, WebP');
			return;
		}

		setError(null);
		setUploading(true);

		try {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('folder', folder);

			const response = await fetch('/api/v1/upload', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to upload image');
			}

			const data = await response.json();
			onChange(data.url);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to upload image');
		} finally {
			setUploading(false);
		}
	};

	const handleRemove = () => {
		onChange('');
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	return (
		<div className="space-y-2">
			<Label>{label} {required && '*'}</Label>
			{value ? (
				<div className="relative">
					<div className="relative w-full h-48 border rounded-lg overflow-hidden">
						<img
							src={value}
							alt="Preview"
							className="w-full h-full object-cover"
						/>
						<Button
							type="button"
							variant="destructive"
							size="icon"
							className="absolute top-2 right-2"
							onClick={handleRemove}
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
					<p className="text-xs text-gray-500 mt-1">Click the X button to remove the image</p>
				</div>
			) : (
				<div className="border-2 border-dashed rounded-lg p-6">
					<div className="flex flex-col items-center justify-center space-y-4">
						<ImageIcon className="h-12 w-12 text-gray-400" />
						<div className="text-center">
							<Button
								type="button"
								variant="outline"
								onClick={() => fileInputRef.current?.click()}
								disabled={uploading}
							>
								<Upload className="mr-2 h-4 w-4" />
								{uploading ? 'Uploading...' : 'Upload Image'}
							</Button>
							<p className="text-xs text-gray-500 mt-2">
								PNG, JPG, GIF, WebP up to 5MB
							</p>
						</div>
					</div>
					<Input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						onChange={handleFileSelect}
						className="hidden"
					/>
				</div>
			)}
			{error && (
				<p className="text-sm text-red-600">{error}</p>
			)}
		</div>
	);
};

