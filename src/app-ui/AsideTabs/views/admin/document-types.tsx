"use client";

import { Plus, MoreVertical, Edit, Trash2, FileText } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { globalStore, type DocumentType } from "@/contexts/luminaStore";
import { CreateDocumentTypeDialog } from "@/components/create-document-type-dialog";
import { EditDocumentTypeDialog } from "@/components/edit-document-type-dialog";

export function DocumentTypes() {
	const [selectedType, setSelectedType] = useState<DocumentType | null>(null);
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);

	const documentTypes = globalStore.use.documentTypes();

	const handleCreateType = (newType: DocumentType) => {
		globalStore.setState((prev) => ({
			documentTypes: [...prev.documentTypes, newType],
		}));
	};

	const handleEditType = (updatedType: DocumentType) => {
		globalStore.setState((prev) => ({
			documentTypes: prev.documentTypes.map((t) =>
				t.id === updatedType.id
					? {
							...updatedType,
							fieldCount: updatedType.schema.fields.length,
						}
					: t,
			),
		}));
	};

	const handleDeleteType = (id: string) => {
		globalStore.setState((prev) => ({
			documentTypes: prev.documentTypes.filter((t) => t.id !== id),
		}));
	};

	const handleEdit = (type: DocumentType) => {
		setSelectedType(type);
		setEditDialogOpen(true);
	};

	return (
		<>
			<header className="sticky top-0 z-10 flex items-center gap-4 border-b border-border bg-background px-6 py-3">
				<div className="flex flex-1 items-center justify-between">
					<div>
						<h1 className="text-2xl font-semibold text-foreground">
							Document Types
						</h1>

						<p className="text-sm text-muted-foreground">
							Manage document schemas and types
						</p>
					</div>

					<Button onClick={() => setCreateDialogOpen(true)}>
						<Plus className="mr-2 h-4 w-4" />
						Create Type
					</Button>
				</div>
			</header>

			<div className="block simple-scrollbar max-h-[calc(100vh-130px)] max-w-full p-6">
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{documentTypes.map((type) => (
						<Card key={type.id}>
							<CardHeader>
								<div className="flex items-start justify-between">
									<div className="flex items-start gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 flex-none">
											<FileText className="h-5 w-5 text-accent" />
										</div>

										<div>
											<CardTitle className="text-base">{type.id}</CardTitle>

											<CardDescription className="mt-1 text-xs">
												{type.description}
											</CardDescription>
										</div>
									</div>

									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="icon" className="h-8 w-8">
												<MoreVertical className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>

										<DropdownMenuContent align="end">
											<DropdownMenuItem onClick={() => handleEdit(type)}>
												<Edit className="mr-2 h-4 w-4 group-hover:text-accent-foreground" />
												Edit
											</DropdownMenuItem>

											<DropdownMenuItem
												onClick={() => handleDeleteType(type.id)}
												className="text-destructive"
											>
												<Trash2 className="mr-2 h-4 w-4 group-hover:text-accent-foreground" />
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</CardHeader>

							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div className="rounded bg-muted/20 p-3">
										<p className="text-xs text-muted-foreground">
											Schema Fields
										</p>

										<p className="text-xl font-semibold text-foreground">
											{type.schema.fields.length}
										</p>
									</div>
								</div>

								<div className="space-y-2">
									<p className="text-xs font-semibold text-foreground">
										Fields ({type.schema.fields.length})
									</p>

									<div className="space-y-1 max-h-40 overflow-y-auto">
										{type.schema.fields.map((field) => (
											<div
												className="flex items-center justify-between rounded bg-muted/20 p-2 text-xs"
												key={field.name}
											>
												<span className="font-medium text-foreground">
													{field.name}
												</span>

												<div className="flex gap-2">
													<Badge variant="outline" className="text-xs bg-white">
														{field.type}
													</Badge>

													{field.required && (
														<Badge className="text-xs bg-accent/20 text-accent">
															Required
														</Badge>
													)}
												</div>
											</div>
										))}
									</div>
								</div>

								<Button
									className="w-full bg-transparent"
									onClick={() => handleEdit(type)}
									variant="outline"
									size="sm"
								>
									<Edit className="mr-2 h-4 w-4" />
									Edit Schema
								</Button>
							</CardContent>
						</Card>
					))}
				</div>

				{documentTypes.length === 0 && (
					<div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center">
						<FileText className="h-12 w-12 text-muted-foreground" />

						<h3 className="mt-4 text-lg font-semibold text-foreground">
							No document types yet
						</h3>

						<p className="mt-2 text-sm text-muted-foreground">
							Create your first document type to define extraction schemas
						</p>

						<Button onClick={() => setCreateDialogOpen(true)} className="mt-4">
							<Plus className="mr-2 h-4 w-4" />
							Create Type
						</Button>
					</div>
				)}
			</div>

			<CreateDocumentTypeDialog
				onOpenChange={setCreateDialogOpen}
				onCreateType={handleCreateType}
				open={createDialogOpen}
			/>

			{selectedType && (
				<EditDocumentTypeDialog
					onOpenChange={setEditDialogOpen}
					documentType={selectedType}
					onEditType={handleEditType}
					open={editDialogOpen}
				/>
			)}
		</>
	);
}
