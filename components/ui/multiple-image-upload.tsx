'use client';
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface MultipleImageUploadProps {
	value?: string[];
	onChange: (urls: string[]) => void;
	folder: 'products' | 'services' | 'events' | 'employees';
	label?: string;
	maxImages?: number;
}

export const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
	value = [],
	onChange,
	folder,
	label = 'Images',
	maxImages = 10,
}) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		if (files.length === 0) return;

		if (value.length + files.length > maxImages) {
			setError(`Maximum ${maxImages} images allowed`);
			return;
		}

		setError(null);
		setUploading(true);

		try {
			const uploadPromises = files.map(async (file) => {
				// Validate file
				const maxSize = 5 * 1024 * 1024; // 5MB
				const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

				if (file.size > maxSize) {
					throw new Error(`${file.name}: Image size must be less than 5MB`);
				}

				if (!allowedTypes.includes(file.type)) {
					throw new Error(`${file.name}: Invalid image type. Allowed: JPEG, PNG, GIF, WebP`);
				}

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
				return data.url;
			});

			const uploadedUrls = await Promise.all(uploadPromises);
			onChange([...value, ...uploadedUrls]);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to upload images');
		} finally {
			setUploading(false);
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		}
	};

	const handleRemove = (index: number) => {
		const newUrls = value.filter((_, i) => i !== index);
		onChange(newUrls);
	};

	return (
		<div className="space-y-2">
			<label className="text-sm font-medium">{label}</label>
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
				{value.map((url, index) => (
					<div key={index} className="relative">
						<div className="relative w-full h-32 border rounded-lg overflow-hidden">
							<img
								src={url}
								alt={`Preview ${index + 1}`}
								className="w-full h-full object-cover"
							/>
							<Button
								type="button"
								variant="destructive"
								size="icon"
								className="absolute top-1 right-1 h-6 w-6"
								onClick={() => handleRemove(index)}
							>
								<X className="h-3 w-3" />
							</Button>
						</div>
					</div>
				))}
				{value.length < maxImages && (
					<div className="border-2 border-dashed rounded-lg p-4">
						<div className="flex flex-col items-center justify-center space-y-2 h-full">
							<ImageIcon className="h-8 w-8 text-gray-400" />
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => fileInputRef.current?.click()}
								disabled={uploading}
							>
								<Upload className="mr-2 h-3 w-3" />
								{uploading ? 'Uploading...' : 'Add'}
							</Button>
						</div>
						<Input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							multiple
							onChange={handleFileSelect}
							className="hidden"
						/>
					</div>
				)}
			</div>
			{error && (
				<p className="text-sm text-red-600">{error}</p>
			)}
			<p className="text-xs text-gray-500">
				{value.length} / {maxImages} images uploaded
			</p>
		</div>
	);
};

