"use client";

import { clientToNextApi } from "@/api";
import {
	MutationObserverOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { useFetchOrganizationList } from "../fetch/use-fetch-organization-list";
import { queryKeys } from "../queryKeys";
import type { Organization } from "@/types/organization";

const mutationKey = [queryKeys.put.ORGANIZATION];

type UpdateOrganizationRequest = Organization;

type UploadDocumentResponse = unknown;

export const useUpdateOrganization = () => {
	const allOrganizations = useFetchOrganizationList();

	const queryClient = useQueryClient();

	function getUpdatedOrganizationList(updatedOrganization: Organization) {
		const orgUuid = updatedOrganization.uuid;
		const orgIndex = allOrganizations.data.findIndex(
			(org) => org.uuid === orgUuid,
		);

		if (orgIndex === -1) {
			throw new Error("Organization does not exist");
		}

		const updatedAllOrganizations = [...allOrganizations.data];
		updatedAllOrganizations[orgIndex] = updatedOrganization;

		return updatedAllOrganizations;
	}

	queryClient.setMutationDefaults(mutationKey, {
		mutationFn: async (updatedOrganization) => {
			const awsKey = `aws-idp/documents/all-organizations.json`;
			const awsBucket = "bb-demos-public-data";

			const updatedJsonFileStringOfAllOrganizations = JSON.stringify(
				getUpdatedOrganizationList(updatedOrganization),
				null,
				2,
			);

			const response = await clientToNextApi.post(
				`/organizations?aws_key=${awsKey}&aws_bucket=${awsBucket}`,
				updatedJsonFileStringOfAllOrganizations,
			);

			return response.data;
		},

		onSuccess: (_, updatedOrganization) => {
			queryClient.setQueryData<Array<Organization>>(
				[queryKeys.get.ORGANIZATION_LIST],
				getUpdatedOrganizationList(updatedOrganization),
			);
		},
	} satisfies MutationObserverOptions<
		UploadDocumentResponse,
		Error,
		UpdateOrganizationRequest
	>);

	return useMutation<UploadDocumentResponse, Error, UpdateOrganizationRequest>({
		retry: false,
		mutationKey,
	});
};
