import { DefaultSuspenseAndErrorBoundary } from "@/components/DefaultSuspenseAndErrorBoundary";
import { memo } from "react";

export const VendorDashboard: React.FC = memo(function VendorDashboard() {
	return (
		<DefaultSuspenseAndErrorBoundary failedText="Failed to load vendor dashboard!"></DefaultSuspenseAndErrorBoundary>
	);
});
