"use client";

import {
	AlertCircle,
	CheckCircle2,
	FileText,
	Loader2,
	UploadIcon,
	X,
} from "lucide-react";
import { useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { AdminTab, globalStore } from "@/contexts/luminaStore";

interface UploadedFile {
	id: string;
	file: File;
	status: "pending" | "processing" | "success" | "error";
	progress: number;
	documentType?: string;
	error?: string;
}

const getRandomFloat = (min: number, max: number): number => {
	return Math.random() * (max - min) + min;
};

const getRandomIntInclusive = (min: number, max: number): number => {
	// Ensure min and max are treated as integers for the range calculation
	const minCeiled = Math.ceil(min);
	const maxFloored = Math.floor(max);

	// The core formula: Math.floor(Math.random() * (max - min + 1) + min)
	// This calculates the size of the inclusive range (max - min + 1),
	// scales Math.random() [0, 1) to that size, floors it to an integer,
	// and then shifts the result to start at the min value.
	return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
};

export function UploadPage() {
	const [selectedType, setSelectedType] = useState<string>("");
	const [files, setFiles] = useState<UploadedFile[]>([]);
	const [isDragging, setIsDragging] = useState(false);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const documentTypes = globalStore.use.documentTypes();

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);

		const droppedFiles = Array.from(e.dataTransfer.files);
		handleFiles(droppedFiles);
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const selectedFiles = Array.from(e.target.files);
			handleFiles(selectedFiles);
		}
	};

	const handleFiles = (newFiles: File[]) => {
		const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
			id: Math.random().toString(36).substr(2, 9),
			file,
			status: "pending",
			progress: 0,
			documentType: selectedType,
		}));

		setFiles([...files, ...uploadedFiles]);

		// Simulate upload and processing
		uploadedFiles.forEach(simulateUpload);
	};

	const simulateUpload = (file: UploadedFile) => {
		// Simulate progress
		let progress = 0;
		const interval = setInterval(() => {
			progress += 10;
			setFiles((prev) =>
				prev.map((f) =>
					f.id === file.id
						? {
								...f,
								progress,
								status: progress < 100 ? "processing" : "success",
							}
						: f,
				),
			);

			if (progress >= 100) {
				clearInterval(interval);

				globalStore.setState((prev) => {
					const lastDocType = prev.documentTypes.at(-1);

					if (!lastDocType) {
						return prev;
					}

					const { fields } = lastDocType.schema;
					const extractedData = fields.map((f) => ({
						name: f.name,
						value:
							f.type === "date"
								? "2023-12-31"
								: f.type === "number"
									? `${getRandomIntInclusive(1, 1000000)}`
									: f.type === "boolean"
										? `${getRandomFloat(0, 1) > 0.5}`
										: "****1234",
						confidence: getRandomFloat(0.75, 1),
						type: f.type,
					}));

					return {
						documentTypes: prev.documentTypes.map((t) =>
							t.name === lastDocType.name
								? { ...t, documentCount: t.documentCount + 1 }
								: t,
						),

						documents: [
							...prev.documents,
							{
								id: file.id,
								fileName: file.file.name,
								documentType: lastDocType.name,
								uploadedAt: new Date().toISOString(),
								status: "pending",
								confidence: getRandomFloat(0.9, 1),
								extractedData,
								file: file.file,
							},
						],
					};
				});
			}
		}, 200);
	};

	const removeFile = (fileId: string) => {
		setFiles(files.filter((f) => f.id !== fileId));
	};

	const getStatusIcon = (status: UploadedFile["status"]) => {
		switch (status) {
			case "processing":
				return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
			case "success":
				return <CheckCircle2 className="h-4 w-4 text-accent" />;
			case "error":
				return <AlertCircle className="h-4 w-4 text-destructive" />;
			default:
				return <FileText className="h-4 w-4 text-muted-foreground" />;
		}
	};

	const getStatusBadge = (status: UploadedFile["status"]) => {
		switch (status) {
			case "processing":
				return <Badge variant="secondary">Processing</Badge>;
			case "success":
				return (
					<Badge className="bg-accent text-accent-foreground">Complete</Badge>
				);
			case "error":
				return <Badge variant="destructive">Failed</Badge>;
			default:
				return <Badge variant="outline">Pending</Badge>;
		}
	};

	function handleReviewFile(fileId: string) {
		globalStore.setState({ fileInReview: fileId, adminTab: AdminTab.ReviewQueue });
	}

	return (
		<>
			<header className="sticky top-0 z-10 flex items-center gap-4 border-b border-border bg-background px-6 py-3">
				<div>
					<h1 className="text-2xl font-semibold text-foreground">
						Upload Documents
					</h1>
					<p className="text-sm text-muted-foreground">
						Upload and process documents for extraction
					</p>
				</div>
			</header>

<div className="block simple-scrollbar max-h-[calc(100vh-130px)] max-w-full p-6 pt-2">
				<div className="w-full space-y-6">
					{/* Document Type Selection */}
					<Card>
						<CardContent className="pt-6">
							<div className="space-y-2">
								<label htmlFor="document-type">Document Type</label>

								<Select value={selectedType} onValueChange={setSelectedType}>
									<SelectTrigger id="document-type">
										<SelectValue placeholder="Select document type" />
									</SelectTrigger>

									<SelectContent>
										{documentTypes.map((type) => (
											<SelectItem key={type.id} value={type.id}>
												{type.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								<p className="text-xs text-muted-foreground">
									Select the document type to apply the correct extraction
									schema
								</p>
							</div>
						</CardContent>
					</Card>

					{/* Upload Area */}
					<Card>
						<CardContent className="pt-6">
							<div
								onClick={() => fileInputRef.current?.click()}
								onDragLeave={handleDragLeave}
								onDragOver={handleDragOver}
								onDrop={handleDrop}
								className={`relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
									isDragging
										? "border-accent bg-primary/5"
										: "border-border bg-muted/20 hover:border-accent/50 hover:bg-muted/40"
								}`}
							>
								<input
									accept=".pdf,.png,.jpg,.jpeg"
									onChange={handleFileSelect}
									ref={fileInputRef}
									className="hidden"
									type="file"
									multiple
								/>

								<div className="flex flex-col items-center gap-4 text-center">
									<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
										<UploadIcon className="h-8 w-8 text-primary" />
									</div>

									<div>
										<p className="text-lg font-medium text-foreground">
											Drop files here or click to browse
										</p>

										<p className="mt-1 text-sm text-muted-foreground">
											Supports PDF, PNG, JPG files up to 10MB each
										</p>
									</div>

									<Button type="button" variant="secondary">
										Select Files
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Uploaded Files List */}
					{files.length > 0 && (
						<Card>
							<CardContent className="pt-6">
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<h3 className="text-lg font-semibold text-foreground">
											Uploaded Files
										</h3>

										<p className="text-sm text-muted-foreground">
											{files.filter((f) => f.status === "success").length} of{" "}
											{files.length} complete
										</p>
									</div>

									<div className="space-y-3">
										{files.map((file) => (
											<div
												className="flex flex-col gap-3 rounded-lg border border-border p-4"
												key={file.id}
											>
												<div className="flex items-center gap-4">
													<div className="flex-shrink-0">
														{getStatusIcon(file.status)}
													</div>

													<div className="flex-1 space-y-2">
														<div className="flex items-center justify-between">
															<div>
																<p className="font-medium text-foreground">
																	{file.file.name}
																</p>

																<p className="text-xs text-muted-foreground">
																	{(file.file.size / 1024 / 1024).toFixed(2)} MB
																	{file.documentType &&
																		` • ${documentTypes.find((t) => t.id === file.documentType)?.name}`}
																</p>
															</div>

															{getStatusBadge(file.status)}
														</div>

														{file.status === "processing" && (
															<Progress
																value={file.progress}
																className="h-1.5"
															/>
														)}

														{file.error && (
															<p className="text-xs text-destructive">
																{file.error}
															</p>
														)}
													</div>

													<Button
														onClick={() => removeFile(file.id)}
														className="flex-shrink-0"
														variant="ghost"
														size="icon"
													>
														<X className="h-4 w-4" />
													</Button>
												</div>

												{file.status === "success" && (
													<div className="flex items-center gap-2">
														<Button
															onClick={() => handleReviewFile(file.id)}
															className="w-full"
														>
															Review
														</Button>
													</div>
												)}
											</div>
										))}
									</div>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</>
	);
}
