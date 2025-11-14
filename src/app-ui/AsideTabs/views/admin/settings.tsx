"use client";

import { Plus, Trash2, Copy, Check, Webhook, Key, Bell } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface WebhookConfig {
	id: string;
	name: string;
	url: string;
	events: string[];
	active: boolean;
	createdAt: string;
}

interface ApiKey {
	id: string;
	name: string;
	key: string;
	createdAt: string;
	lastUsed?: string;
}

export function SettingsPage() {
	const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
		{
			id: "1",
			name: "Production Webhook",
			url: "https://api.example.com/webhooks/idp",
			events: ["document.processed", "document.approved"],
			active: true,
			createdAt: "2024-01-10T10:00:00",
		},
	]);

	const [apiKeys, setApiKeys] = useState<ApiKey[]>([
		{
			id: "1",
			name: "Production API Key",
			key: "sk_live_abc123xyz789",
			createdAt: "2024-01-05T14:30:00",
			lastUsed: "2024-01-15T09:45:00",
		},
	]);

	const [newWebhookName, setNewWebhookName] = useState("");
	const [newWebhookUrl, setNewWebhookUrl] = useState("");
	const [newWebhookEvents, setNewWebhookEvents] = useState<string[]>([]);
	const [copiedKey, setCopiedKey] = useState<string | null>(null);

	const availableEvents = [
		{ value: "document.uploaded", label: "Document Uploaded" },
		{ value: "document.processed", label: "Document Processed" },
		{ value: "document.approved", label: "Document Approved" },
		{ value: "document.rejected", label: "Document Rejected" },
		{ value: "extraction.completed", label: "Extraction Completed" },
		{ value: "extraction.failed", label: "Extraction Failed" },
	];

	const handleAddWebhook = () => {
		if (!newWebhookName || !newWebhookUrl || newWebhookEvents.length === 0)
			return;

		const webhook: WebhookConfig = {
			id: Date.now().toString(),
			name: newWebhookName,
			url: newWebhookUrl,
			events: newWebhookEvents,
			active: true,
			createdAt: new Date().toISOString(),
		};

		setWebhooks([...webhooks, webhook]);
		setNewWebhookName("");
		setNewWebhookUrl("");
		setNewWebhookEvents([]);
	};

	const handleDeleteWebhook = (id: string) => {
		setWebhooks(webhooks.filter((w) => w.id !== id));
	};

	const handleToggleWebhook = (id: string) => {
		setWebhooks(
			webhooks.map((w) => (w.id === id ? { ...w, active: !w.active } : w)),
		);
	};

	const handleGenerateApiKey = () => {
		const key: ApiKey = {
			id: Date.now().toString(),
			name: `API Key ${apiKeys.length + 1}`,
			key: `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
			createdAt: new Date().toISOString(),
		};

		setApiKeys([...apiKeys, key]);
	};

	const handleDeleteApiKey = (id: string) => {
		setApiKeys(apiKeys.filter((k) => k.id !== id));
	};

	const handleCopyKey = (key: string) => {
		navigator.clipboard.writeText(key);
		setCopiedKey(key);
		setTimeout(() => setCopiedKey(null), 2000);
	};

	const toggleEvent = (event: string) => {
		if (newWebhookEvents.includes(event)) {
			setNewWebhookEvents(newWebhookEvents.filter((e) => e !== event));
		} else {
			setNewWebhookEvents([...newWebhookEvents, event]);
		}
	};

	return (
		<>
			<header className="sticky top-0 z-10 flex items-center gap-4 border-b border-border bg-background px-6 py-3">
				<div>
					<h1 className="text-2xl font-semibold text-foreground">Settings</h1>

					<p className="text-sm text-muted-foreground">
						Configure API keys, webhooks, and notifications
					</p>
				</div>
			</header>

			<div className="block simple-scrollbar max-h-[calc(100vh-130px)] max-w-full p-6">
				<div className="mx-auto max-w-5xl flex-1 simple-scrollbar">
					<Tabs defaultValue="api-keys" className="space-y-6">
						<TabsList>
							<TabsTrigger value="api-keys">
								<Key className="mr-2 h-4 w-4" />
								API Keys
							</TabsTrigger>

							<TabsTrigger value="webhooks">
								<Webhook className="mr-2 h-4 w-4" />
								Webhooks
							</TabsTrigger>

							<TabsTrigger value="notifications">
								<Bell className="mr-2 h-4 w-4" />
								Notifications
							</TabsTrigger>
						</TabsList>

						{/* API Keys Tab */}
						<TabsContent value="api-keys" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>API Keys</CardTitle>

									<CardDescription>
										Manage API keys for programmatic access to the IDP platform.
										Keep your keys secure and never share them publicly.
									</CardDescription>
								</CardHeader>

								<CardContent className="space-y-4">
									<Button onClick={handleGenerateApiKey}>
										<Plus className="mr-2 h-4 w-4" />
										Generate New Key
									</Button>

									<div className="space-y-3">
										{apiKeys.map((apiKey) => (
											<div
												className="flex items-center justify-between rounded-lg border border-border p-4"
												key={apiKey.id}
											>
												<div className="flex-1 space-y-1">
													<div className="flex items-center gap-2">
														<p className="font-medium text-foreground">
															{apiKey.name}
														</p>

														<Badge variant="secondary" className="text-xs">
															Active
														</Badge>
													</div>

													<div className="flex items-center gap-2">
														<code className="rounded bg-muted px-2 py-1 text-xs text-foreground">
															{apiKey.key}
														</code>

														<Button
															onClick={() => handleCopyKey(apiKey.key)}
															className="h-6 w-6"
															variant="ghost"
															size="icon"
														>
															{copiedKey === apiKey.key ? (
																<Check className="h-3 w-3 text-accent" />
															) : (
																<Copy className="h-3 w-3" />
															)}
														</Button>
													</div>

													<div className="flex gap-4 text-xs text-muted-foreground">
														<span>
															Created:{" "}
															{new Date(apiKey.createdAt).toLocaleDateString()}
														</span>

														{apiKey.lastUsed && (
															<span>
																Last used:{" "}
																{new Date(apiKey.lastUsed).toLocaleDateString()}
															</span>
														)}
													</div>
												</div>

												<Button
													onClick={() => handleDeleteApiKey(apiKey.id)}
													className="group"
													variant="ghost"
													size="icon"
												>
													<Trash2 className="h-4 w-4 text-destructive group-hover:text-accent-foreground" />
												</Button>
											</div>
										))}

										{apiKeys.length === 0 && (
											<div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center">
												<Key className="h-12 w-12 text-muted-foreground" />

												<h3 className="mt-4 text-lg font-semibold text-foreground">
													No API keys yet
												</h3>

												<p className="mt-2 text-sm text-muted-foreground">
													Generate your first API key to start using the API
												</p>
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Webhooks Tab */}
						<TabsContent value="webhooks" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Add Webhook</CardTitle>

									<CardDescription>
										Configure webhooks to receive real-time notifications when
										events occur
									</CardDescription>
								</CardHeader>

								<CardContent className="space-y-4">
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<label htmlFor="webhook-name">Webhook Name</label>

											<Input
												onChange={(e) => setNewWebhookName(e.target.value)}
												placeholder="e.g., Production Webhook"
												value={newWebhookName}
												id="webhook-name"
											/>
										</div>

										<div className="space-y-2">
											<label htmlFor="webhook-url">Webhook URL</label>

											<Input
												onChange={(e) => setNewWebhookUrl(e.target.value)}
												placeholder="https://api.example.com/webhooks"
												value={newWebhookUrl}
												id="webhook-url"
											/>
										</div>
									</div>

									<div className="space-y-2">
										<label>Events to Subscribe</label>

										<div className="grid gap-2 md:grid-cols-2">
											{availableEvents.map((event) => (
												<div
													key={event.value}
													className="flex items-center space-x-2"
												>
													<Switch
														checked={newWebhookEvents.includes(event.value)}
														onCheckedChange={() => toggleEvent(event.value)}
														id={event.value}
													/>

													<label
														htmlFor={event.value}
														className="text-sm font-normal"
													>
														{event.label}
													</label>
												</div>
											))}
										</div>
									</div>

									<Button
										disabled={
											!newWebhookName ||
											!newWebhookUrl ||
											newWebhookEvents.length === 0
										}
										onClick={handleAddWebhook}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Webhook
									</Button>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Active Webhooks</CardTitle>

									<CardDescription>
										Manage your configured webhook endpoints
									</CardDescription>
								</CardHeader>

								<CardContent className="space-y-3">
									{webhooks.map((webhook) => (
										<div
											key={webhook.id}
											className="rounded-lg border border-border p-4"
										>
											<div className="flex items-start justify-between">
												<div className="flex-1 space-y-2">
													<div className="flex items-center gap-2">
														<h3 className="font-semibold text-foreground">
															{webhook.name}
														</h3>

														<Badge
															variant={webhook.active ? "default" : "secondary"}
															className="text-xs"
														>
															{webhook.active ? "Active" : "Inactive"}
														</Badge>
													</div>

													<p className="text-sm text-muted-foreground">
														{webhook.url}
													</p>

													<div className="flex flex-wrap gap-2">
														{webhook.events.map((event) => (
															<Badge
																key={event}
																variant="outline"
																className="text-xs"
															>
																{availableEvents.find((e) => e.value === event)
																	?.label || event}
															</Badge>
														))}
													</div>

													<p className="text-xs text-muted-foreground">
														Created:{" "}
														{new Date(webhook.createdAt).toLocaleDateString()}
													</p>
												</div>

												<div className="flex items-center gap-2">
													<Switch
														checked={webhook.active}
														onCheckedChange={() =>
															handleToggleWebhook(webhook.id)
														}
													/>

													<Button
														variant="ghost"
														size="icon"
														onClick={() => handleDeleteWebhook(webhook.id)}
													>
														<Trash2 className="h-4 w-4 text-destructive" />
													</Button>
												</div>
											</div>
										</div>
									))}

									{webhooks.length === 0 && (
										<div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center">
											<Webhook className="h-12 w-12 text-muted-foreground" />

											<h3 className="mt-4 text-lg font-semibold text-foreground">
												No webhooks configured
											</h3>

											<p className="mt-2 text-sm text-muted-foreground">
												Add your first webhook to receive real-time
												notifications
											</p>
										</div>
									)}
								</CardContent>
							</Card>
						</TabsContent>

						{/* Notifications Tab */}
						<TabsContent value="notifications" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Notification Preferences</CardTitle>

									<CardDescription>
										Configure how and when you receive notifications
									</CardDescription>
								</CardHeader>

								<CardContent className="space-y-6">
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<div className="space-y-0.5">
												<label>Email Notifications</label>

												<p className="text-sm text-muted-foreground">
													Receive email alerts for important events
												</p>
											</div>

											<Switch defaultChecked />
										</div>

										<div className="flex items-center justify-between">
											<div className="space-y-0.5">
												<label>Document Processing Complete</label>

												<p className="text-sm text-muted-foreground">
													Notify when document extraction is complete
												</p>
											</div>

											<Switch defaultChecked />
										</div>

										<div className="flex items-center justify-between">
											<div className="space-y-0.5">
												<label>Low Confidence Alerts</label>

												<p className="text-sm text-muted-foreground">
													Alert when extraction confidence is below threshold
												</p>
											</div>

											<Switch defaultChecked />
										</div>

										<div className="flex items-center justify-between">
											<div className="space-y-0.5">
												<label>Daily Summary</label>

												<p className="text-sm text-muted-foreground">
													Receive daily processing summary reports
												</p>
											</div>

											<Switch />
										</div>
									</div>

									<div className="space-y-2">
										<label htmlFor="confidence-threshold">
											Confidence Threshold
										</label>

										<Select defaultValue="75">
											<SelectTrigger id="confidence-threshold">
												<SelectValue />
											</SelectTrigger>

											<SelectContent>
												<SelectItem value="90">90% - High</SelectItem>
												<SelectItem value="75">75% - Medium</SelectItem>
												<SelectItem value="60">60% - Low</SelectItem>
											</SelectContent>
										</Select>

										<p className="text-xs text-muted-foreground">
											Documents below this confidence level will require manual
											review
										</p>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</>
	);
}
