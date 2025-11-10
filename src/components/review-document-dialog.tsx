"use client";

import {
  AlertTriangle,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useWithFileInReview } from "@/contexts/luminaStore";
import { ScrollArea } from "./ui/scroll-area";

interface ExtractedField {
	name: string;
	value: string;
	confidence: number;
	type: string;
}

interface ReviewDocumentDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onApprove: (docId: string, updatedData?: ExtractedField[]) => void;
	onReject: (docId: string) => void;
}

export function ReviewDocumentDialog({
	open,
	onOpenChange,
	onApprove,
	onReject,
}: ReviewDocumentDialogProps) {
	const document = useWithFileInReview();

	const [editedData, setEditedData] = useState<ExtractedField[]>(
		document.extractedData,
	);
	const [fileBlobUrl, setFileBlobUrl] = useState<string | null>(null);

	useEffect(() => {
		setEditedData(document.extractedData);

		if (document.file) {
			setFileBlobUrl(URL.createObjectURL(document.file));
		}
	}, [document]);

	useEffect(() => {
		return () => {
			if (fileBlobUrl) {
				URL.revokeObjectURL(fileBlobUrl);
			}
		};
	}, [fileBlobUrl]);

	const handleFieldChange = (index: number, value: string) => {
		const newData = [...editedData];
		// @ts-expect-error => ignore
		newData[index] = { ...newData[index], value };
		setEditedData(newData);
	};

	const getConfidenceColor = (confidence: number) => {
		if (confidence >= 0.9) return "text-accent";
		if (confidence >= 0.75) return "text-yellow-500";
		return "text-destructive";
	};

	const getConfidenceIcon = (confidence: number) => {
		if (confidence >= 0.9)
			return <CheckCircle2 className="h-4 w-4 text-accent" />;
		if (confidence >= 0.75)
			return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
		return <XCircle className="h-4 w-4 text-destructive" />;
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="sm:max-w-[90vw] data-[has-file=true]:w-[90vw] w-[40vw] max-h-[90vh] simple-scrollbar"
				data-has-file={!!fileBlobUrl}
			>
				<DialogHeader className="flex flex-row justify-between">
					<div className="flex flex-col gap-2">
						<DialogTitle>Review Document</DialogTitle>

						<DialogDescription>
							Review and edit extracted data before approval. Fields with low
							confidence are highlighted.
						</DialogDescription>
					</div>
				</DialogHeader>

				<div className="flex gap-6">
					{fileBlobUrl && (
						<div className="w-1/2">
							<object
								className="flex h-full w-full rounded-md min-h-[50vh]"
								type="application/pdf"
								data={fileBlobUrl}
							>
								Your browser does not support displaying PDFs.
							</object>
						</div>
					)}

					<div
						className="space-y-4 w-full data-[has-file=true]:w-1/2"
						data-has-file={!!fileBlobUrl}
					>
						{/* Document Info */}
						<div className="rounded-lg border border-border bg-muted/20 p-4">
							<div className="grid grid-cols-2 gap-4 text-sm">
								<div>
									<p className="text-muted-foreground">File Name</p>
									<p className="font-medium text-foreground">
										{document.fileName}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground">Document Type</p>
									<p className="font-medium text-foreground">
										{document.documentType}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground">Upload Date</p>
									<p className="font-medium text-foreground">
										{new Date(document.uploadedAt).toLocaleString()}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground">Overall Confidence</p>
									<p
										className={`font-semibold ${getConfidenceColor(document.confidence)}`}
									>
										{(document.confidence * 100).toFixed(0)}%
									</p>
								</div>
							</div>
						</div>

						{/* Extracted Fields */}
						<ScrollArea className="h-[400px] rounded-lg border border-border p-4">
							<div className="space-y-4">
								<h3 className="font-semibold text-foreground">
									Extracted Fields
								</h3>
								{editedData.map((field, index) => (
									<div
										key={index}
										className="space-y-2 rounded-lg border border-border p-3"
									>
										<div className="flex items-center justify-between">
											<label
												className="text-sm font-medium"
												htmlFor={`field-${index}`}
											>
												{field.name}
											</label>

											<div className="flex items-center gap-2">
												{getConfidenceIcon(field.confidence)}

												<span
													className={`text-xs font-medium ${getConfidenceColor(field.confidence)}`}
												>
													{(field.confidence * 100).toFixed(0)}%
												</span>

												<Badge variant="outline" className="text-xs">
													{field.type}
												</Badge>
											</div>
										</div>

										<Input
											onChange={(e) => handleFieldChange(index, e.target.value)}
											id={`field-${index}`}
											value={field.value}
											className={
												field.confidence < 0.75 ? "border-destructive" : ""
											}
										/>

										{field.confidence < 0.75 && (
											<p className="text-xs text-destructive">
												Low confidence - please verify this value
											</p>
										)}
									</div>
								))}
							</div>
						</ScrollArea>
					</div>
				</div>

				<DialogFooter className="gap-2">
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>

					<Button variant="destructive" onClick={() => onReject(document.id)}>
						<XCircle className="mr-2 h-4 w-4" />
						Reject
					</Button>

					<Button
						className="bg-accent text-accent-foreground hover:bg-accent/90"
						onClick={() => onApprove(document.id, editedData)}
					>
						<CheckCircle2 className="mr-2 h-4 w-4" />
						Approve
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
