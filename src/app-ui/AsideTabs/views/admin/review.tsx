"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Eye, FileText, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { globalStore, type Document_V2 } from "@/contexts/luminaStore";
import { ReviewDocumentDialog } from "@/components/review-document-dialog";

interface ExtractedField {
	confidence: number;
	value: string;
	name: string;
	type: string;
}

export function ReviewPage() {
	const [activeTab, setActiveTab] = useState("pending");

	const fileInReview = globalStore.use.fileInReview();
	const documents = globalStore.use.documents();

	const handleReview = (doc: Document_V2) => {
		globalStore.setState({ fileInReview: doc.id });
	};

	const handleApprove = (docId: string, updatedData?: ExtractedField[]) => {
		globalStore.setState((prev) => ({
			documents: prev.documents.map((doc) =>
				doc.id === docId
					? {
							...doc,
							status: "approved",
							extractedData: updatedData || doc.extractedData,
						}
					: doc,
			),
			fileInReview: null,
		}));
	};

	const handleReject = (docId: string) => {
		globalStore.setState((prev) => ({
			documents: prev.documents.map((doc) =>
				doc.id === docId ? { ...doc, status: "rejected" } : doc,
			),
			fileInReview: null,
		}));
	};

	const getConfidenceColor = (confidence: number) => {
		if (confidence >= 0.9) return "text-accent";
		if (confidence >= 0.75) return "text-yellow-500";
		return "text-destructive";
	};

	const getConfidenceBadge = (confidence: number) => {
		if (confidence >= 0.9)
			return <Badge className="bg-accent text-accent-foreground">High</Badge>;
		if (confidence >= 0.75) return <Badge variant="secondary">Medium</Badge>;
		return <Badge variant="destructive">Low</Badge>;
	};

	const filteredDocuments = documents.filter((doc) => {
		if (activeTab === "all") return true;
		return doc.status === activeTab;
	});

	const stats = {
		pending: documents.filter((d) => d.status === "pending").length,
		approved: documents.filter((d) => d.status === "approved").length,
		rejected: documents.filter((d) => d.status === "rejected").length,
	};

	return (
		<>
			<header className="sticky top-0 z-10 flex items-center gap-4 border-b border-border bg-background px-6 py-3">
				<div>
					<h1 className="text-2xl font-semibold text-foreground">
						Review Queue
					</h1>

					<p className="text-sm text-muted-foreground">
						Review and validate extracted document data
					</p>
				</div>
			</header>

			<div className="block simple-scrollbar max-h-[calc(100vh-130px)] max-w-full">
				<div className="mx-auto max-w-6xl p-6 space-y-6">
					{/* Stats Cards */}
					<div className="grid gap-4 md:grid-cols-3">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Pending Review
								</CardTitle>

								<FileText className="h-4 w-4 text-muted-foreground" />
							</CardHeader>

							<CardContent>
								<div className="text-2xl font-bold text-foreground">
									{stats.pending}
								</div>

								<p className="text-xs text-muted-foreground">
									Documents awaiting review
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Approved</CardTitle>

								<CheckCircle2 className="h-4 w-4 text-accent" />
							</CardHeader>

							<CardContent>
								<div className="text-2xl font-bold text-foreground">
									{stats.approved}
								</div>

								<p className="text-xs text-muted-foreground">
									Successfully validated
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Rejected</CardTitle>

								<XCircle className="h-4 w-4 text-destructive" />
							</CardHeader>

							<CardContent>
								<div className="text-2xl font-bold text-foreground">
									{stats.rejected}
								</div>

								<p className="text-xs text-muted-foreground">
									Failed validation
								</p>
							</CardContent>
						</Card>
					</div>

					{/* Documents List */}
					<Card>
						<CardContent className="pt-6">
							<Tabs value={activeTab} onValueChange={setActiveTab}>
								<TabsList className="mb-4">
									<TabsTrigger value="pending">
										Pending ({stats.pending})
									</TabsTrigger>
									<TabsTrigger value="approved">
										Approved ({stats.approved})
									</TabsTrigger>
									<TabsTrigger value="rejected">
										Rejected ({stats.rejected})
									</TabsTrigger>
									<TabsTrigger value="all">
										All ({documents.length})
									</TabsTrigger>
								</TabsList>

								<TabsContent value={activeTab} className="space-y-4">
									{filteredDocuments.length === 0 ? (
										<div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center">
											<FileText className="h-12 w-12 text-muted-foreground" />

											<h3 className="mt-4 text-lg font-semibold text-foreground">
												No documents found
											</h3>

											<p className="mt-2 text-sm text-muted-foreground">
												{activeTab === "pending"
													? "All documents have been reviewed"
													: `No ${activeTab} documents at this time`}
											</p>
										</div>
									) : (
										filteredDocuments.map((doc) => (
											<div
												key={doc.id}
												className="rounded-lg border border-border p-4"
											>
												<div className="flex items-start justify-between">
													<div className="flex items-start gap-4">
														<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
															<FileText className="h-6 w-6 text-primary" />
														</div>

														<div className="space-y-2">
															<div>
																<h3 className="font-semibold text-foreground">
																	{doc.fileName}
																</h3>

																<div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
																	<span className="flex items-center gap-1">
																		<FileText className="h-3 w-3" />
																		{doc.documentType}
																	</span>

																	<span className="flex items-center gap-1">
																		<Calendar className="h-3 w-3" />

																		{new Date(
																			doc.uploadedAt,
																		).toLocaleDateString()}
																	</span>
																</div>
															</div>

															<div className="flex items-center gap-2">
																<span className="text-sm text-muted-foreground">
																	Confidence:
																</span>

																<span
																	className={`text-sm font-semibold ${getConfidenceColor(doc.confidence)}`}
																>
																	{(doc.confidence * 100).toFixed(0)}%
																</span>

																{getConfidenceBadge(doc.confidence)}
															</div>

															<div className="flex flex-wrap gap-2">
																{doc.extractedData.slice(0, 3).map((field) => (
																	<Badge
																		key={field.name}
																		variant="outline"
																		className="text-xs"
																	>
																		{field.name}: {field.value}
																	</Badge>
																))}

																{doc.extractedData.length > 3 && (
																	<Badge
																		variant="secondary"
																		className="text-xs"
																	>
																		+{doc.extractedData.length - 3} more
																	</Badge>
																)}
															</div>
														</div>
													</div>

													<div className="flex items-center gap-2">
														{doc.status === "pending" ? (
															<>
																<Button
																	variant="outline"
																	size="sm"
																	onClick={() => handleReview(doc)}
																>
																	<Eye className="mr-2 h-4 w-4" />
																	Review
																</Button>

																<Button
																	className="bg-accent text-accent-foreground hover:bg-accent/90"
																	onClick={() => handleApprove(doc.id)}
																	variant="default"
																	size="sm"
																>
																	<CheckCircle2 className="mr-2 h-4 w-4" />
																	Approve
																</Button>

																<Button
																	variant="destructive"
																	size="sm"
																	onClick={() => handleReject(doc.id)}
																>
																	<XCircle className="mr-2 h-4 w-4" />
																	Reject
																</Button>
															</>
														) : (
															<Badge
																className={
																	doc.status === "approved"
																		? "bg-accent text-accent-foreground"
																		: undefined
																}
																variant={
																	doc.status === "approved"
																		? "default"
																		: "destructive"
																}
															>
																{doc.status === "approved" ? (
																	<>
																		<CheckCircle2 className="mr-1 h-3 w-3" />
																		Approved
																	</>
																) : (
																	<>
																		<XCircle className="mr-1 h-3 w-3" />
																		Rejected
																	</>
																)}
															</Badge>
														)}
													</div>
												</div>
											</div>
										))
									)}
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>
				</div>
			</div>

			{fileInReview && (
				<ReviewDocumentDialog
					onOpenChange={() => globalStore.setState({ fileInReview: null })}
					onApprove={handleApprove}
					onReject={handleReject}
					open
				/>
			)}
		</>
	);
}
