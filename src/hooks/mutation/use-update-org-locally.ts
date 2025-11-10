"use client";

import {
	MutationObserverOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";

import { useFetchOrganizationList } from "../fetch/use-fetch-organization-list";
import { queryKeys } from "../queryKeys";
import type { Organization } from "@/types/organization";

type UpdateOrgLocallyRequest = Organization;

type UpdateOrgLocallyResponse = null;

const mutationKey = ["update-org-locally"];

export const useUpdateOrgLocally = () => {
	useFetchOrganizationList();

	const queryClient = useQueryClient();

	queryClient.setMutationDefaults(mutationKey, {
		mutationFn: async (updatedOrganization) => {
			let error = "";

			queryClient.setQueryData<Array<Organization>>(
				[queryKeys.get.ORGANIZATION_LIST],
				(cachedOrgs) => {
					if (!cachedOrgs) {
						error = "No cachedOrgs";

						return cachedOrgs;
					}

					const oldOrgIndex = cachedOrgs.findIndex(
						(o) => o.uuid === updatedOrganization.uuid,
					);

					if (oldOrgIndex === -1) {
						error = "No oldOrg";

						return cachedOrgs;
					}

					const nextOrgs = [...cachedOrgs];

					nextOrgs[oldOrgIndex] = updatedOrganization;

					return nextOrgs;
				},
			);

			if (error) {
				throw new Error(error);
			}

			return null;
		},
		onError: (error) => {
			console.error("Error updating org locally:", error);
		},
	} satisfies MutationObserverOptions<
		UpdateOrgLocallyResponse,
		Error,
		UpdateOrgLocallyRequest
	>);

	return useMutation<UpdateOrgLocallyResponse, Error, UpdateOrgLocallyRequest>({
		retry: false,
		mutationKey,
	});
};
