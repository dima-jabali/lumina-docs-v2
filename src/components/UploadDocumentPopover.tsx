import { Plus, Upload, X } from "lucide-react";
import { memo, useRef, useState, type PropsWithChildren } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useUploadFiles } from "@/hooks/mutation/use-upload-files";
import { toast } from "sonner";
import { hasErrorMessage } from "@/lib/utils";
import { isSupportFileType } from "@/helpers/utils";
import { matchIcon } from "@/helpers/matchIcon";

const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
	e.stopPropagation();
	e.preventDefault();
};

const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
	e.stopPropagation();
	e.preventDefault();
};

const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
	e.stopPropagation();
};

export const UploadDocumentPopover = memo(function UploadDocumentPopover({
	children,
}: PropsWithChildren) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				{children ?? (
					<button className="flex items-center gap-2 px-2 py-1 rounded-md text-accent-foreground bg-accent button-hover-accent">
						<Plus className="size-4 text-white" />

						<span>Upload document</span>
					</button>
				)}
			</DialogTrigger>

			<DialogContent>
				{isOpen ? <Content setIsOpen={setIsOpen} /> : null}
			</DialogContent>
		</Dialog>
	);
});

const Content: React.FC<{
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setIsOpen }) => {
	const [files, setFiles] = useState<Array<File>>([]);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const uploadFiles = useUploadFiles();

	const isUploading = uploadFiles.isPending;

	const handleUploadFiles = async () => {
		if (isUploading) return;

		try {
			const promises = files.map((file) => uploadFiles.mutateAsync({ file }));

			await Promise.allSettled(promises);

			setIsOpen(false);
			clearFiles();
		} catch (error) {
			const msg = "Error uploading files";

			console.error(msg, error);

			toast(msg, {
				description: hasErrorMessage(error) ? error.message : undefined,
			});
		}
	};

	const handleSelectedFiles = async (files: Array<File> | FileList | null) => {
		if (!files || files.length === 0) return;

		const supportedFiles: Array<File> = [];

		for (const file of files) {
			if (isSupportFileType(file.type)) {
				supportedFiles.push(file);
			} else {
				toast("Unsupported file type", {
					description: `File type ${file.type} is not supported.`,
				});
			}
		}

		for (const file of supportedFiles) {
			if (file.type.startsWith("image")) {
				const previewUrl = URL.createObjectURL(file);

				Reflect.set(file, "previewUrl", previewUrl);
			}
		}

		setFiles((prev) => [...prev, ...supportedFiles]);
	};

	const handleFilesChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
		await handleSelectedFiles(e.target.files);
	};

	const handleOnDrop = async (e: React.DragEvent<HTMLDivElement>) => {
		await handleSelectedFiles(e.dataTransfer.files);
	};

	const handleRemoveFile = (file: File) => {
		setFiles((prev) => {
			const previewUrl = Reflect.get(file, "previewUrl");

			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}

			return prev.filter((f) => f !== file);
		});
	};

	const clearFiles = () => {
		setFiles((prev) => {
			prev.forEach((file) => {
				const previewUrl = Reflect.get(file, "previewUrl");

				if (previewUrl) {
					URL.revokeObjectURL(previewUrl);
				}
			});

			return [];
		});

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<>
			<DialogHeader className="font-bold text-xl whitespace-nowrap min-w-fit">
				Upload documents
			</DialogHeader>

			<div
				className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-border-smooth aria-disabled:pointer-events-none hover:border-accent"
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDragOver={handleDragOver}
				onDrop={handleOnDrop}
				title="Select files"
			>
				{files.length > 0 ? (
					<ul className="flex flex-wrap h-full w-full items-center justify-center simple-scrollbar max-h-96 max-w-full pt-2 pb-1 gap-2">
						{files.map((file, index) => {
							const isImage = file.type.startsWith("image");
							const previewUrl: string | undefined =
								isImage && Reflect.get(file, "previewUrl");

							if (isImage && previewUrl) {
								return (
									<div
										className="relative flex flex-col flex-none gap-2 p-2 items-center group w-52 h-auto rounded-md border border-border-smooth"
										key={index}
									>
										<button
											className="absolute p-0.5 bg-slate-200 border border-border-smooth active:bg-slate-300 hover:bg-slate-100 -right-1.5 -top-1.5 invisible group-hover:visible rounded-full"
											onClick={() => handleRemoveFile(file)}
											title="Remove file"
										>
											<X className="size-3 stroke-black" />
										</button>

										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img
											className="rounded-sm"
											alt="Image preview"
											src={previewUrl}
										/>
									</div>
								);
							}

							return (
								<div
									className="relative flex flex-none gap-2 p-2 items-center group w-52 h-10 rounded-md border border-border-smooth "
									key={index}
								>
									<button
										className="absolute p-0.5 bg-slate-200 border border-border-smooth active:bg-slate-300 hover:bg-slate-100 -right-1.5 -top-1.5 invisible group-hover:visible rounded-full"
										onClick={() => handleRemoveFile(file)}
										title="Remove file"
									>
										<X className="size-3 stroke-black" />
									</button>

									{matchIcon(file.type)}

									<p className="truncate" title={file.name}>
										{file.name}
									</p>
								</div>
							);
						})}
					</ul>
				) : (
					<label className="flex cursor-pointer flex-col items-center justify-center p-4 text-center md:p-8">
						<Upload className="size-10 text-accent" />

						<p className="mx-auto mt-3 max-w-xs text-primary">
							Click to <span className="font-bold">Upload your documents</span>{" "}
							or drag and drop files here
						</p>

						<input
							onChange={handleFilesChosen}
							contentEditable={false}
							accept=".pdf,image/*"
							ref={fileInputRef}
							className="hidden"
							type="file"
							multiple
						/>
					</label>
				)}
			</div>

			<footer className="flex items-center justify-between gap-4 w-full pt-2">
				<div>
					<Button
						onClick={() => fileInputRef.current?.click()}
						disabled={isUploading}
					>
						<Plus className="size-4 text-secondary" />

						<span>Select files</span>
					</Button>
				</div>

				<div className="flex items-center gap-2">
					<Button
						onClick={() => setIsOpen(false)}
						disabled={isUploading}
						variant="destructive"
					>
						Cancel
					</Button>

					<Button
						disabled={files.length === 0}
						onClick={handleUploadFiles}
						isLoading={isUploading}
						variant="success"
					>
						Upload{isUploading ? "ing..." : ""}
					</Button>
				</div>
			</footer>
		</>
	);
};
