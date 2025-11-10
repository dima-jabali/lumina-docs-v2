"use client";

import {
	Edit,
	FolderOpen,
	MoreVertical,
	Plus,
	Settings,
	Trash2,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { globalStore, type Application } from "@/contexts/luminaStore";
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
import { CreateApplicationDialog } from "@/components/create-application-dialog";
import { EditApplicationDialog } from "@/components/edit-application-dialog";

export function Applications() {
	const [selectedApp, setSelectedApp] = useState<Application | null>(null);
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);

	const applicationList = globalStore.use.applicationList();

	const handleCreateApp = (newApp: Omit<Application, "id" | "createdAt">) => {
		const app: Application = {
			...newApp,
			createdAt: new Date().toISOString(),
			id: Date.now().toString(),
		};

		globalStore.setState((prev) => ({
			applicationList: [...prev.applicationList, app],
		}));
	};

	const handleEditApp = (updatedApp: Application) => {
		globalStore.setState((prev) => ({
			applicationList: prev.applicationList.map((a) =>
				a.id === updatedApp.id ? updatedApp : a,
			),
		}));
	};

	const handleDeleteApp = (id: string) => {
		globalStore.setState((prev) => ({
			applicationList: prev.applicationList.filter((a) => a.id !== id),
		}));
	};

	const handleEdit = (app: Application) => {
		setEditDialogOpen(true);
		setSelectedApp(app);
	};

	return (
		<>
			<header className="sticky top-0 z-10 flex items-center gap-4 border-b border-border bg-background px-6 py-3">
				<div className="flex flex-1 items-center justify-between">
					<div>
						<h1 className="text-2xl font-semibold text-foreground">
							Applications
						</h1>

						<p className="text-sm text-muted-foreground">
							Configure document processing applications
						</p>
					</div>

					<Button onClick={() => setCreateDialogOpen(true)}>
						<Plus className="mr-2 h-4 w-4" />
						Create Application
					</Button>
				</div>
			</header>

			<div className="block simple-scrollbar max-h-[calc(100vh-130px)] max-w-full p-6">
				<div className="grid gap-6 md:grid-cols-2">
					{applicationList.map((app) => (
						<Card key={app.id} className="relative">
							<CardHeader>
								<div className="flex items-start justify-between">
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
											<FolderOpen className="h-5 w-5 text-accent" />
										</div>

										<div>
											<CardTitle className="text-lg">{app.name}</CardTitle>

											<CardDescription className="mt-1">
												{app.description}
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
											<DropdownMenuItem onClick={() => handleEdit(app)}>
												<Edit className="mr-2 h-4 w-4 group-hover:text-accent-foreground" />
												Edit
											</DropdownMenuItem>

											<DropdownMenuItem
												onClick={() => handleDeleteApp(app.id)}
												className="text-destructive"
											>
												<Trash2 className="mr-2 h-4 w-4 group-hover:text-accent-foreground" />
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</CardHeader>

							<CardContent className="flex flex-col justify-between gap-4 flex-1">
								<div className="flex flex-col gap-4">
									<div className="space-y-2">
										<p className="text-sm font-semibold text-foreground">
											Document Types ({app.documentTypes.length})
										</p>

										<div className="flex flex-wrap gap-2">
											{app.documentTypes.map((docType) => (
												<Badge
													key={docType}
													className="text-primary"
													variant="secondary"
												>
													{docType}
												</Badge>
											))}
										</div>
									</div>

									<div className="space-y-2">
										<p className="text-sm font-semibold text-foreground">
											Validation Rules ({app.validationRules.length})
										</p>

										<div className="space-y-2">
											{app.validationRules.slice(0, 2).map((rule) => (
												<div
													className="flex items-start gap-2 rounded bg-muted/20 p-2 text-xs"
													key={rule.id}
												>
													<div className="mt-0.5 h-2 w-2 rounded-full bg-accent" />

													<div>
														<p className="font-medium text-foreground">
															{rule.name}
														</p>

														<p className="text-muted-foreground">
															{rule.description}
														</p>
													</div>
												</div>
											))}

											{app.validationRules.length > 2 && (
												<p className="text-xs text-muted-foreground">
													+{app.validationRules.length - 2} more rule
													{app.validationRules.length - 2 !== 1 ? "s" : ""}
												</p>
											)}
										</div>
									</div>
								</div>

								<Button
									className="w-full bg-transparent"
									onClick={() => handleEdit(app)}
									variant="outline"
									size="sm"
								>
									<Settings className="mr-2 h-4 w-4" />
									Configure
								</Button>
							</CardContent>
						</Card>
					))}
				</div>

				{applicationList.length === 0 && (
					<div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center">
						<FolderOpen className="h-12 w-12 text-muted-foreground" />

						<h3 className="mt-4 text-lg font-semibold text-foreground">
							No applications yet
						</h3>

						<p className="mt-2 text-sm text-muted-foreground">
							Create your first application to start configuring document
							workflows
						</p>

						<Button onClick={() => setCreateDialogOpen(true)} className="mt-4">
							<Plus className="mr-2 h-4 w-4" />
							Create Application
						</Button>
					</div>
				)}
			</div>

			<CreateApplicationDialog
				onOpenChange={setCreateDialogOpen}
				onCreateApp={handleCreateApp}
				open={createDialogOpen}
			/>

			{selectedApp && (
				<EditApplicationDialog
					onOpenChange={setEditDialogOpen}
					onEditApp={handleEditApp}
					application={selectedApp}
					open={editDialogOpen}
				/>
			)}
		</>
	);
}
