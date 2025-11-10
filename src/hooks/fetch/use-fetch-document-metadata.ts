import axios from "axios";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

import { hasErrorMessage, isValidNumber } from "@/lib/utils";
import type { DocumentId } from "@/types/document";
import { queryKeys } from "../queryKeys";

export const useFetchDocumentMetadata = (
	documentId: DocumentId,
	enabled = true,
) => {
	return useQuery({
		queryKey: [queryKeys.get.DOCUMENT_BLOB, documentId],
		enabled: enabled && isValidNumber(documentId),
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		staleTime: Infinity, // never stale
		gcTime: Infinity, // never gc
		retry: false,
		queryFn: async () => {
			try {
				if (!isValidNumber(documentId)) {
					throw new Error(
						`Invalid document id. Received \`${documentId}\` (type: ${typeof documentId}), expected a number`,
					);
				}

				const fileResponse = await axios.get(
					`${process.env.NEXT_PUBLIC_DJANGO_BACKEND_ROOT_URL}/api/v1/aws-demo-files/${documentId}`,
				);

				return fileResponse.data;
			} catch (error) {
				console.log("Error fetching file by presigned URL:", error);

				toast("Error fetching file", {
					description: hasErrorMessage(error) ? error.message : undefined,
				});

				throw error;
			}
		},
	});
};
