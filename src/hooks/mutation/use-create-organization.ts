"use client";

import {
	MutationObserverOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";

import { clientToNextApi } from "@/api";
import { useFetchOrganizationList } from "../fetch/use-fetch-organization-list";
import { queryKeys } from "../queryKeys";
import type { Organization } from "@/types/organization";

const mutationKey = [queryKeys.post.ORGANIZATION];

type CreateOrganizationRequest = Organization;

type UploadDocumentResponse = unknown;

export const useCreateOrganization = () => {
	const allOrganizations = useFetchOrganizationList();

	const queryClient = useQueryClient();

	queryClient.setMutationDefaults(mutationKey, {
		mutationFn: async (newOrg) => {
			{
				const newOrgUuid = newOrg.uuid;

				if (allOrganizations.data.find((org) => org.uuid === newOrgUuid)) {
					throw new Error("Organization already exists");
				}
			}

			const awsKey = `aws-idp/documents/all-organizations.json`;
			const awsBucket = "bb-demos-public-data";

			const updatedAllOrganizations = allOrganizations.data.concat(newOrg);
			const updatedJsonFileStringOfAllOrganizations = JSON.stringify(
				updatedAllOrganizations,
				null,
				2,
			);

			const response = await clientToNextApi.post(
				`/organizations?aws_key=${awsKey}&aws_bucket=${awsBucket}`,
				updatedJsonFileStringOfAllOrganizations,
			);

			return response.data;
		},

		onSuccess: (_, newOrg) => {
			queryClient.setQueryData<Array<Organization>>(
				[queryKeys.get.ORGANIZATION_LIST],
				allOrganizations.data.concat(newOrg),
			);
		},
	} satisfies MutationObserverOptions<
		UploadDocumentResponse,
		Error,
		CreateOrganizationRequest
	>);

	return useMutation<UploadDocumentResponse, Error, CreateOrganizationRequest>({
		retry: false,
		mutationKey,
	});
};
