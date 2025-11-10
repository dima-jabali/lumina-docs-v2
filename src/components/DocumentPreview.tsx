"use client";

import { memo } from "react";

import { MimeType } from "@/helpers/utils";
import { cn } from "@/lib/utils";
import { DefaultSuspenseAndErrorBoundary } from "./DefaultSuspenseAndErrorBoundary";

type Props = {
	fileBlobUrl: string;
	mimeType: MimeType;
	className?: string;
};

export const DocumentPreview: React.FC<Props> = memo(
	function DocumentPreview(props) {
		return (
			<DefaultSuspenseAndErrorBoundary failedText="Failed to load file preview!">
				<DocumentPreview_ {...props} />
			</DefaultSuspenseAndErrorBoundary>
		);
	},
);

const DocumentPreview_: React.FC<Props> = ({
	fileBlobUrl,
	mimeType,
	className,
}) => {
	if (mimeType.startsWith("image/")) {
		return <ImagePreview className={className} fileBlobUrl={fileBlobUrl} />;
	}

	switch (mimeType) {
		// case MimeType.Csv:
		// 	return <CsvPreview className={className} fileBlobUrl={fileBlobUrl} />;

		case MimeType.Pdf:
			return <PdfPreview fileBlobUrl={fileBlobUrl} className={className} />;

		case MimeType.Image:
			return <ImagePreview className={className} fileBlobUrl={fileBlobUrl} />;

		default:
			return null;
	}
};

// const CsvPreview: React.FC<{ fileBlobUrl: string; className?: string }> = ({
// 	fileBlobUrl,
// 	className,
// }) => {
// 	return (
// 		<Suspense fallback={<FallbackLoader />}>
// 			<CsvToHtmlTable className={className} csv={fileBlobUrl} />
// 		</Suspense>
// 	);
// };

const PdfPreview: React.FC<{
	fileBlobUrl: string;
	className?: string;
}> = ({ className, fileBlobUrl }) => {
	return fileBlobUrl ? (
		<object
			className={cn("flex h-full w-full rounded-md min-h-[50vh]", className)}
			type="application/pdf"
			data={fileBlobUrl}
		>
			Your browser does not support displaying PDFs.
		</object>
	) : null;
};

const ImagePreview: React.FC<{
	fileBlobUrl: string;
	className?: string;
}> = ({ className, fileBlobUrl }) => {
	return fileBlobUrl ? (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			className={cn("flex w-full rounded-md object-contain", className)}
			src={fileBlobUrl}
			alt=""
		/>
	) : null;
};
