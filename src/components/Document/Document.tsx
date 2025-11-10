"use client";

import { PopoverTrigger } from "@radix-ui/react-popover";
import {
	Bot,
	ChevronLeft,
	ChevronRight,
	ChevronsLeftIcon,
	File,
	List,
	Pencil,
	Plus,
	Trash,
	User,
} from "lucide-react";
import { Resizable } from "re-resizable";
import {
	memo,
	useCallback,
	useEffect,
	useRef,
	useState,
	type PropsWithChildren,
} from "react";
import { titleCase } from "scule";

import { ChatWithLuminaDocs } from "@/app-ui/AsideTabs/views/ChatWithLuminaDocs";
import {
	Stepper,
	StepperDescription,
	StepperIndicator,
	StepperItem,
	StepperSeparator,
	StepperTrigger,
} from "@/components/ui/stepper";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { matchStatusClassName } from "@/helpers/utils";
import { useFileMetadata } from "@/hooks/fetch/use-fetch-document-metadata-list";
import {
	useCurrentOrganization,
	useSteps,
} from "@/hooks/fetch/use-fetch-organization-list";
import { useUpdateOrgLocally } from "@/hooks/mutation/use-update-org-locally";
import {
	isValidNumber,
	shortDateFormatter,
	stopPropagation,
} from "@/lib/utils";
import type { Document } from "@/types/document";
import { View } from "@/types/general-enums";
import type { FileMetadataStep } from "@/types/organization";
import { DefaultSuspenseAndErrorBoundary } from "../DefaultSuspenseAndErrorBoundary";
import { UploadDocumentPopover } from "../UploadDocumentPopover";
import { Button } from "../ui/button";
import { Popover, PopoverContent } from "../ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CurrentStepDetails } from "./CurrentStepDetails";
import { DocumentPreviewView } from "./DocumentPreviewView";
import { RulesView } from "./Rules/Rules";
import { StepSettings } from "./StepSettings";
import { getSubFileType } from "./utils";
import { globalStore, useDocType } from "@/contexts/luminaStore";
import { Badge } from "../ui/badge";

const HANDLE_CLASSES_CONTAINER = {
	left: "bg-button-hover/50 button-hover z-0 w-1!",
};
const ENABLED_CONTAINER = {
	bottomRight: false,
	bottomLeft: false,
	topRight: false,
	topLeft: false,
	bottom: false,
	right: false,
	left: true,
	top: false,
};
const DISABLED_CONTAINER = {
	bottomRight: false,
	bottomLeft: false,
	topRight: false,
	topLeft: false,
	bottom: false,
	right: false,
	left: false,
	top: false,
};

export const DocumentView = memo(function Document() {
	const [isChatOpen, setIsChatOpen] = useState(false);

	const updateOrgLocally = useUpdateOrgLocally().mutate;
	const fileMetadata = useFileMetadata();
	const org = useCurrentOrganization();
	const view = globalStore.use.view();
	const steps = useSteps();

	const steppersSectionRef = useRef<HTMLDivElement>(null);

	const handleGoBack = () => {
		globalStore.setState({
			view: View.TableOfDocs,
			fileMetadataUuid: null,
			selectedSubFile: null,
		});

		if (org) {
			updateOrgLocally({
				...org,
				currentCategory: 1,
				currentStep: 1,
			});
		}
	};

	const handleGoBackRef = useRef(handleGoBack);
	handleGoBackRef.current = handleGoBack;

	const handleToggleOpenChat = useCallback(() => {
		setIsChatOpen((prev) => !prev);
	}, []);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.code === "KeyB" && event.altKey) {
				handleGoBackRef.current();
			} else if (event.code === "KeyC" && event.altKey) {
				handleToggleOpenChat();
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleToggleOpenChat]);

	if (!steps || !org) {
		console.log("no steps or org", { steps, org });

		return null;
	}

	function handleUpdateCurrentStep(newStep: number) {
		if (!org) return;

		const updatedOrg = { ...org };

		updatedOrg.currentStep = newStep;

		updateOrgLocally(updatedOrg);
	}

	const createdAt = fileMetadata?.created_at;
	const createdAtFormatted = createdAt
		? shortDateFormatter.format(new Date(createdAt))
		: "—";

	const updatedAt = fileMetadata?.updated_at;
	const updatedAtFormatted = updatedAt
		? shortDateFormatter.format(new Date(updatedAt))
		: "—";

	const numberOfSteps = steps.length;

	return (
		<div
			className="data-[hidden=true]:hidden flex gap-2 w-full h-screen max-h-[calc(100vh-83px)] min-w-1 overflow-hidden"
			data-hidden={view !== View.Document}
		>
			<section
				className="@container flex flex-col h-full gap-10 w-full pr-4 simple-scrollbar"
				aria-label="Document"
			>
				<header className="flex flex-col items-center gap-10 w-full">
					<div className="flex items-center w-full justify-between gap-4">
						<button
							className="flex items-center gap-1 px-2 py-1 text-xs rounded button-hover"
							title="Go back to table of documents"
							onClick={handleGoBack}
							type="button"
						>
							<ChevronLeft className="size-3 text-primary" />

							<span>Back</span>

							<kbd className="text-muted-foreground rounded bg-gray-100 px-1 ml-0.5 text-[10px] shadow-xs shadow-black/30">
								Alt+B
							</kbd>
						</button>

						<Tooltip delayDuration={50}>
							<TooltipTrigger
								className="aspect-square rounded-lg flex items-center justify-center button-hover size-6"
								title="Toggle open Lumina Docs Dashboard Chat"
								onClick={() => setIsChatOpen((prev) => !prev)}
							>
								<ChevronsLeftIcon
									className="size-4 data-[is-open=true]:rotate-180 text-primary"
									data-is-open={isChatOpen}
								/>
							</TooltipTrigger>

							<TooltipContent
								className="bg-popover rounded-lg border border-border-smooth  px-2 py-1 text-xs text-primary"
								sideOffset={5}
								side="left"
							>
								Toggle open Lumina Docs Chat (Alt+C)
							</TooltipContent>
						</Tooltip>
					</div>

					<ul className="grid-cols-1 @[500px]:grid-cols-2 @[800px]:grid-cols-3 grid @[1000px]:grid-cols-4 items-center text-xs gap-4 w-full">
						<li className="flex flex-col gap-1 items-start justify-center rounded-md p-4 border border-border-smooth/20 shadow-md shadow-black/5 h-full">
							<span className="text-muted-foreground">FILE NAME</span>

							<span
								className="text-base truncate max-w-full"
								title={fileMetadata?.file_name || undefined}
							>
								{fileMetadata?.file_name}
							</span>
						</li>

						<li className="flex flex-col gap-1 items-start justify-center rounded-md p-4 border border-border-smooth/20 shadow-md shadow-black/5 h-full">
							<span className="text-muted-foreground">CREATED AT</span>

							<span
								className="text-base truncate max-w-full"
								title={createdAtFormatted}
							>
								{createdAtFormatted}
							</span>
						</li>

						<li className="flex flex-col gap-1 items-start justify-center rounded-md p-4 border border-border-smooth/20 shadow-md shadow-black/5 h-full">
							<span className="text-muted-foreground">UPDATED AT</span>

							<span
								className="text-base truncate max-w-full"
								title={updatedAtFormatted}
							>
								{updatedAtFormatted}
							</span>
						</li>

						<li className="flex flex-col gap-1 items-start justify-center rounded-md p-4 border border-border-smooth/20 shadow-md shadow-black/5 h-full">
							<span className="text-muted-foreground">STATUS</span>

							<span
								className="text-base truncate max-w-full first-letter:capitalize"
							>
								<Badge className={matchStatusClassName(fileMetadata?.status)}>

								{titleCase(fileMetadata?.status?.toLowerCase() ?? "")}
								</Badge>
							</span>
						</li>
					</ul>

					<RulesView key={fileMetadata?.id} />

					<section
						className="space-y-8 px-16 flex-col gap-8 flex w-full max-w-full simple-scrollbar box-border flex-nowrap"
						ref={steppersSectionRef}
						aria-label="Steppers"
					>
						<Stepper
							onValueChange={handleUpdateCurrentStep}
							value={org.currentStep}
							className="w-full pb-4"
						>
							{steps.map((item) => {
								const {
									currentSubStep,
									isCompleted,
									description,
									isAutomated,
									subSteps,
									title,
									step,
								} = item;

								return (
									<StepperItem
										className="relative flex-1 flex-col! group"
										completed={isCompleted}
										step={step}
										key={step}
									>
										<StepperTrigger className="flex-col gap-3 rounded">
											<StepperIndicator />

											<div className="space-y-0.5 px-2">
												<StepperTitle step={item}>
													{title}

													<span title={isAutomated ? "Automated" : "Manual"}>
														{isAutomated ? (
															<Bot className="size-3 text-muted" />
														) : (
															<User className="size-3 text-muted" />
														)}
													</span>
												</StepperTitle>

												<StepperDescription>{description}</StepperDescription>

												{subSteps ? (
													<Stepper
														value={currentSubStep}
														orientation="vertical"
														className="pt-4"
													>
														{subSteps.map(({ step, title, isCompleted }) => (
															<StepperItem
																className="relative items-start not-last:flex-1"
																completed={isCompleted}
																step={step}
																key={step}
															>
																<StepperTrigger
																	className="items-start rounded pb-4 last:pb-0"
																	onClick={stopPropagation}
																>
																	<StepperIndicator className="size-5 text-xs" />

																	<div className="mt-0.5 space-y-0.5 px-2 text-left">
																		<h3
																			className="text-xs text-muted font-medium"
																			data-slot="stepper-title"
																		>
																			{title}
																		</h3>
																	</div>
																</StepperTrigger>

																{step < subSteps.length ? (
																	<StepperSeparator className="absolute inset-y-0 top-6 left-2.5 -order-1 m-0 -translate-x-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none group-data-[orientation=vertical]/stepper:h-[calc(100%-1.5rem-0.25rem)]" />
																) : null}
															</StepperItem>
														))}
													</Stepper>
												) : null}
											</div>
										</StepperTrigger>

										{step < numberOfSteps ? (
											<StepperSeparator
												className="absolute inset-x-0 top-3 left-[calc(50%+0.75rem+0.125rem)] -order-1 m-0 -translate-y-1/2 group-data-[orientation=horizontal]/stepper:left-[calc(50%+0.75rem)] group-data-[orientation=horizontal]/stepper:w-[calc(130%)] data-[last=true]:group-data-[orientation=horizontal]/stepper:w-[calc(90%)] group-data-[orientation=horizontal]/stepper:flex-none z-0"
												data-last={step === numberOfSteps - 1}
											/>
										) : null}
									</StepperItem>
								);
							})}
						</Stepper>
					</section>
				</header>

				<div className="grid grid-cols-1 @[800px]:grid-cols-2 gap-8 pb-2.5">
					<section aria-label="File">
						<DefaultSuspenseAndErrorBoundary
							failedText="Error loading file!"
							key={fileMetadata?.file_uuid}
							failedClassName="rounded-md"
						>
							{fileMetadata ? (
								fileMetadata.mortgages || fileMetadata.commission_files ? (
									<SubFileList fileMetadata={fileMetadata} />
								) : (
									<DocumentPreviewView fileMetadata={fileMetadata} />
								)
							) : null}
						</DefaultSuspenseAndErrorBoundary>
					</section>

					<CurrentStepDetails key={fileMetadata?.id} />
				</div>
			</section>

			<Resizable
				className="flex h-full max-h-full flex-col gap-2 data-[is-chat-open=false]:hidden"
				enable={isChatOpen ? ENABLED_CONTAINER : DISABLED_CONTAINER}
				handleClasses={HANDLE_CLASSES_CONTAINER}
				data-is-chat-open={isChatOpen}
				key={fileMetadata?.file_uuid}
				maxWidth={700}
				minWidth={370}
			>
				<ChatWithLuminaDocs />
			</Resizable>
		</div>
	);
});

function SubFileList({ fileMetadata }: { fileMetadata: Document }) {
	const [tab, setTab] = useState("file-list");

	const selectedSubFile = globalStore.use.selectedSubFile();
	const docType = useDocType();

	const subFilesType = getSubFileType(docType);

	function onTabChange(value: string) {
		if (value === "file-list") {
			globalStore.setState({ selectedSubFile: null });
		}

		setTab(value);
	}

	function handleGoToPreviousFile() {
		globalStore.setState((prev) => {
			if (subFilesType !== "commission_files" && subFilesType !== "mortgages") {
				return prev;
			}

			const next = { ...prev };

			const currentFileUuid = selectedSubFile?.file_uuid;

			const currentFileIndex = fileMetadata[subFilesType]?.findIndex(
				(f) => f.file_uuid === currentFileUuid,
			);

			if (isValidNumber(currentFileIndex) && currentFileIndex > -1) {
				const prevFile =
					fileMetadata[subFilesType]?.[currentFileIndex - 1] ?? null;

				if (prevFile) {
					next.selectedSubFile = prevFile;
				} else {
					return prev;
				}
			} else {
				return prev;
			}

			return next;
		});
	}

	function handleGoToNextFile() {
		globalStore.setState((prev) => {
			if (subFilesType !== "commission_files" && subFilesType !== "mortgages") {
				return prev;
			}

			const next = { ...prev };

			const currentFileUuid = selectedSubFile?.file_uuid;

			const currentFileIndex = fileMetadata[subFilesType]?.findIndex(
				(f) => f.file_uuid === currentFileUuid,
			);

			if (isValidNumber(currentFileIndex) && currentFileIndex > -1) {
				const nextFile =
					fileMetadata[subFilesType]?.[currentFileIndex + 1] ?? null;

				if (nextFile) {
					next.selectedSubFile = nextFile;
				} else return prev;
			} else {
				return prev;
			}

			return next;
		});
	}

	const subFiles = fileMetadata[subFilesType];

	return (
		<Tabs
			className="flex flex-col h-full border border-border-smooth/30 rounded-md overflow-hidden"
			onValueChange={onTabChange}
			defaultValue="file-list"
			value={tab}
		>
			<TabsList
				className="bg-background flex p-0 gap-0 h-9 w-full rounded-none items-start justify-start"
				title="Files list"
			>
				<TabsTrigger
					overwriteClassName="flex overflow-hidden rounded-none border-b border-border-smooth/30 py-2 text-sm px-2 gap-2 h-9 items-center last:rounded-br-md data-[state=active]:bg-accent data-[state=active]:text-white w-fit rounded-bl-none!"
					value="file-list"
				>
					<List className="size-4" />

					<span>Files</span>
				</TabsTrigger>

				{selectedSubFile ? (
					<TabsTrigger
						overwriteClassName="flex overflow-hidden rounded-none border-b border-r border-border py-2 text-sm px-2 gap-2 items-center h-9 rounded-br-md data-[state=active]:bg-accent data-[state=active]:text-white max-w-44"
						title={selectedSubFile.file_name || undefined}
						value="file"
					>
						<File className="size-4 flex-none" />

						<span className="truncate">{selectedSubFile.file_name}</span>
					</TabsTrigger>
				) : null}

				<div className="ml-auto h-full flex gap-1 items-center justify-center px-1">
					{selectedSubFile ? (
						<>
							<button
								className="rounded-sm aspect-square h-[80%] button-hover flex items-center justify-center"
								title="Previous file"
								onClick={handleGoToPreviousFile}
							>
								<ChevronLeft className="size-3 text-muted flex-none" />
							</button>

							<button
								className="rounded-sm aspect-square h-[80%] button-hover flex items-center justify-center"
								title="Next file"
								onClick={handleGoToNextFile}
							>
								<ChevronRight className="size-3 text-muted flex-none" />
							</button>
						</>
					) : null}

					<UploadDocumentPopover>
						<Button size="sm" variant="ghost" title="Upload more files">
							<Plus className="size-3" />
						</Button>
					</UploadDocumentPopover>
				</div>
			</TabsList>

			<TabsContent
				className="flex flex-col text-muted h-full w-full text-sm"
				value="file-list"
			>
				{Array.isArray(subFiles) &&
					subFiles.map((subFile) => (
						<button
							className="px-2 py-1 rounded-none button-hover w-full flex items-center gap-2 justify-between"
							title={`${subFile.isValidated ? "Processed file: " : "Processing file: "}"${subFile.file_name}"`}
							key={subFile.id}
							onClick={() => {
								globalStore.setState({ selectedSubFile: subFile });
								setTab("file");
							}}
						>
							<div className="flex items-center gap-2">
								<File className="size-4 stroke-muted" />

								<span>{subFile.file_name}</span>
							</div>

							<span
								data-is-validated={subFile.isValidated}
								className="size-1 data-[is-validated=true]:bg-blue-400 data-[is-validated=true]:animate-none bg-yellow-600 rounded-full animate-pulse"
							></span>
						</button>
					))}
			</TabsContent>

			<TabsContent
				className="flex h-full w-full items-center justify-center min-h-24"
				value="file"
				title={selectedSubFile?.file_name || undefined}
			>
				<DefaultSuspenseAndErrorBoundary
					failedText={
						selectedSubFile
							? `Error loading file "${selectedSubFile.file_name}"!`
							: "Error loading file!"
					}
					key={selectedSubFile?.file_uuid}
					failedClassName="rounded-md"
				>
					{selectedSubFile ? (
						<DocumentPreviewView
							fileMetadata={selectedSubFile}
							docType={docType}
						/>
					) : null}
				</DefaultSuspenseAndErrorBoundary>
			</TabsContent>
		</Tabs>
	);
}

const StepperTitle: React.FC<
	PropsWithChildren & { step: FileMetadataStep }
> = ({ children, step }) => {
	return (
		<div className="flex gap-2 items-center justify-center">
			<span className="size-5 flex-none aspect-square"></span>

			<h3
				className="text-xs font-bold uppercase text-muted-foreground flex gap-2 items-center whitespace-nowrap"
				data-slot="stepper-title"
			>
				{children}
			</h3>

			<Popover>
				<PopoverTrigger
					className="size-5 rounded-full button-hover invisible flex items-center justify-center aspect-square group-hover:visible data-[state=open]:visible data-[state=open]:bg-button-active"
					onClick={stopPropagation}
					title="Edit step"
				>
					<Pencil className="size-3 text-muted" />
				</PopoverTrigger>

				<PopoverContent onClick={stopPropagation} side="right" align="start">
					<StepSettings step={step} key={Math.random()} />

					<button className="flex items-center gap-2 rounded-sm button-hover w-full p-2 pr-4 text-xs">
						<span className="size-3 flex-none"></span>

						<span>Add step to left</span>
					</button>

					<button className="flex items-center gap-2 rounded-sm button-hover w-full p-2 pr-4 text-xs">
						<span className="size-3 flex-none"></span>

						<span>Add step to right</span>
					</button>

					<button className="flex items-center gap-2 rounded-sm button-hover w-full p-2 pr-4 text-xs">
						<Trash className="size-3" />

						<span>Delete step</span>
					</button>
				</PopoverContent>
			</Popover>
		</div>
	);
};
