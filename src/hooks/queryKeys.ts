export const queryKeys = Object.freeze({
	get: {
		DOCUMENT_METADATA_LIST: "get=document-metadata-list",
		ORGANIZATION_LIST: "get=organization-list",
		DOCUMENT_BLOB: "get=document-blob",
	},
	put: {
		DOCUMENT_METADATA: "put=document-metadata",
		ORGANIZATION: "put=organization",
	},
	post: {
		DOCUMENTS_BLOBS: "post=documents-blobs",
		ORGANIZATION: "post=organization",
	},
} as const);
