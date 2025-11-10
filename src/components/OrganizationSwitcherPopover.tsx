"use client";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { globalStore } from "@/contexts/luminaStore";
import {
	useCurrentOrganization,
	useFetchOrganizationList,
} from "@/hooks/fetch/use-fetch-organization-list";
import type { OrganizationUuid } from "@/types/organization";

export function OrganizationSwitcherPopover() {
	const currentOrganization = useCurrentOrganization();
	const allOrganizations = useFetchOrganizationList();

	function handleChangeOrg(newOrgUuid: OrganizationUuid) {
		globalStore.setState({
			organizationUuid: newOrgUuid,
		});
	}

	return (
		<Select value={currentOrganization?.uuid} onValueChange={handleChangeOrg}>
			<SelectTrigger
				className="border-border-smooth w-[180px]"
				title="Select an organization"
			>
				<SelectValue placeholder="Select an organization" />
			</SelectTrigger>

			<SelectContent>
				<SelectGroup>
					{allOrganizations.data.map((org) => (
						<SelectItem key={org.uuid} value={org.uuid}>
							{org.name}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
