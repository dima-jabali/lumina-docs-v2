"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";

import { clientToNextApi } from "@/api";
import { hasErrorMessage } from "@/lib/utils";
import { MakeOrganization, type Organization } from "@/types/organization";
import { ArkErrors } from "arktype";
import { queryKeys } from "../queryKeys";
import { globalStore } from "@/contexts/luminaStore";

type OrganizationListResponse = {
	jsonFileAsText: string;
};

export function useFetchOrganizationList<SelectedData = Array<Organization>>(
	select?: (data: Array<Organization>) => SelectedData,
) {
	return useSuspenseQuery({
		queryKey: [queryKeys.get.ORGANIZATION_LIST],
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		staleTime: Infinity, // never stale
		gcTime: Infinity, // never gc
		retry: false,
		select,
		queryFn: async () => {
			try {
				const awsKey = "aws-idp/documents/all-organizations.json";
				const awsBucket = "bb-demos-public-data";

				const res = await clientToNextApi.get<OrganizationListResponse>(
					`/organizations?aws_bucket=${awsBucket}&aws_key=${awsKey}`,
				);

				const parsed = JSON.parse(res.data.jsonFileAsText) as Array<
					Partial<Organization>
				>;

				const validated = parsed
					.map((org) => {
						org.currentCategory = 1;
						org.currentStep = 1;

						const validated = MakeOrganization(org);

						if (validated instanceof ArkErrors) {
							console.error("Error parsing org!", { validated, org });

							return null;
						}

						return validated;
					})
					.filter(Boolean) as Array<Organization>;

				return validated;
			} catch (error) {
				console.log("Error fetching all organizations:", error);

				toast.error("Error fetching all organizations", {
					description: hasErrorMessage(error) ? error.message : undefined,
				});

				throw error;
			}
		},
	});
}

export function useCurrentOrganization() {
	const organizationUuid = globalStore.use.organizationUuid();

	const selectCurrentOrganization = useCallback(
		(organizations: Array<Organization>) => {
			const org = organizations.find((org) => org.uuid === organizationUuid);

			return org;
		},
		[organizationUuid],
	);

	const organization = useFetchOrganizationList(selectCurrentOrganization);

	return organization.data;
}

export function useLogo() {
	const org = useCurrentOrganization();

	return org?.logo;
}

export function useIsStepCompleted(step: number) {
	const docType = globalStore.use.docType();
	const org = useCurrentOrganization();

	if (!org?.steps || !docType) return false;

	return org.steps[docType]?.find((s) => s.step === step)?.isCompleted ?? false;
}

export function useCurrentStep() {
	const docType = globalStore.use.docType();
	const org = useCurrentOrganization();

	if (!org?.steps || !docType) {
		console.log("no steps or org or docType", { org, docType });

		return null;
	}

	const { currentStep } = org;
	const step = org.steps[docType]?.find((s) => s.step === currentStep);

	return step;
}

export function useSteps() {
	const docType = globalStore.use.docType();
	const org = useCurrentOrganization();

	if (!org?.steps || !docType) {
		console.log("no steps or org or docType", { org, docType });

		return null;
	}

	const steps = org.steps[docType];

	return steps;
}
