"use client";

import { DefaultSuspenseAndErrorBoundary } from "@/components/DefaultSuspenseAndErrorBoundary";
import { DocumentView } from "@/components/Document/Document";
import { TableOfDocs } from "@/components/TableOfDocs/TableOfDocs";
import { TypesOfDocsList } from "@/components/TypesOfDocsList/TypesOfDocsList";
import { UploadDocumentPopover } from "@/components/UploadDocumentPopover";
import { globalStore } from "@/contexts/luminaStore";
import { View } from "@/types/general-enums";

export const FilesTable: React.FC = () => {
	const view = globalStore.use.view();

	return (
		<section
			className="flex h-full max-h-full w-full flex-col gap-4 p-4 overflow-hidden"
			aria-label="Lumina Docs"
		>
			<div
				className="data-[hidden=true]:hidden flex flex-col gap-4"
				data-hidden={view !== View.TableOfDocs}
				aria-label="Table of docs"
			>
				<header className="flex items-center justify-between gap-4 py-2">
					<TypesOfDocsList />

					<UploadDocumentPopover />
				</header>

				<TableOfDocs />
			</div>

			<DefaultSuspenseAndErrorBoundary failedText="Error loading document!">
				<DocumentView />
			</DefaultSuspenseAndErrorBoundary>
		</section>
	);
};
