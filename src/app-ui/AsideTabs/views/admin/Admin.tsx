"use client";

import { AdminTab, globalStore } from "@/contexts/luminaStore";
import { Applications } from "./applications";
import { DocumentTypes } from "./document-types";
import { ReviewPage } from "./review";
import { SettingsPage } from "./settings";
import { UploadPage } from "./upload";

export function Admin() {
	const adminTab = globalStore.use.adminTab();

	switch (adminTab) {
		case AdminTab.Applications:
			return <Applications />;

		case AdminTab.DocumentTypes:
			return <DocumentTypes />;

		case AdminTab.Upload:
			return <UploadPage />;

		case AdminTab.ReviewQueue:
			return <ReviewPage />;

		case AdminTab.Settings:
			return <SettingsPage />;

		default:
			return null;
	}
}
