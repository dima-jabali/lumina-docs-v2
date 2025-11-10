import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";

import type { DocumentUuid } from "@/types/document";
import { queryKeys } from "../queryKeys";
import { hasErrorMessage } from "@/lib/utils";
import { clientToNextApi } from "@/api";
import type { getSubFileType } from "@/components/Document/utils";

export const useFetchDocumentBlobUrl = ({
	documentFileType,
	enabled = true,
	documentUuid,
	subFile,
}: {
	subFile?: {
		type: ReturnType<typeof getSubFileType>;
		file_name: string | null;
		file_uuid: string;
	};
	documentFileType: string | undefined | null;
	documentUuid: DocumentUuid;
	enabled?: boolean;
}) => {
	return useQuery({
		queryKey: [queryKeys.get.DOCUMENT_BLOB, documentUuid, documentFileType],
		enabled: enabled && !!documentUuid && !!documentFileType,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		staleTime: Infinity, // never stale
		gcTime: Infinity, // never gc
		retry: false,
		queryFn: async () => {
			try {
				if (subFile) {
					if (!subFile.file_name) {
						throw new Error(
							`Invalid document file name. Received \`${subFile.file_name}\` (type: ${typeof subFile.file_name}), expected a string`,
						);
					}

					const blobRes = await axios.get(
						`/${subFile.type}/${subFile.file_name}`,
						{
							responseType: "blob",
						},
					);

					const fileUrl = URL.createObjectURL(blobRes.data);

					return fileUrl;
				} else {
					const awsBucket = "lending-flow-bucket43879c71-hrshpz2v7jtn";
					const awsKey = `documents/${documentUuid}`;
					const awsRegion = "us-west-2";

					const res = await clientToNextApi.get(
						`/?aws_bucket=${awsBucket}&aws_key=${awsKey}&region=${awsRegion}`,
					);

					const fileAsBase64String = `data:${documentFileType};base64,${res.data.fileBase64String}`;

					const blob = await fetch(fileAsBase64String).then((res) =>
						res.blob(),
					);

					const fileUrl = URL.createObjectURL(blob);

					return fileUrl;
				}
			} catch (error) {
				const msg = "Error fetching file";

				console.log(msg, error);

				toast(msg, {
					description: hasErrorMessage(error) ? error.message : undefined,
				});

				throw error;
			}
		},
	});
};
