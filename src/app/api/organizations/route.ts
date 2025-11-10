import {
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
	S3ServiceException,
} from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

const AWS_SECRET_ACCESS_KEY = process.env.BB_AWS_SECRET_ACCESS_KEY;
const AWS_ACCESS_KEY_ID = process.env.BB_AWS_ACCESS_KEY_ID;

export const config = {
	api: {
		bodyParser: false, // Disable default Next.js body parser
	},
};

export type GetAwsFileResponse = {
	fileBase64String: string;
};

export async function GET(req: NextRequest) {
	// 	const token = req.headers.authorization;
	//
	// 	if (!token) {
	// 		return res.status(403).send("An auth token is required.");
	// 	}

	const { searchParams } = req.nextUrl;
	const region = searchParams.get("region") || "us-west-1";
	const awsBucket = searchParams.get("aws_bucket");
	const awsKey = searchParams.get("aws_key");

	if (
		!awsBucket ||
		!awsKey ||
		awsBucket === "undefined" ||
		awsKey === "undefined"
	) {
		return NextResponse.json(
			{ error: "aws_bucket and aws_key query params are required." },
			{ status: 403 },
		);
	}

	try {
		const s3 = new S3Client({
			credentials: {
				secretAccessKey: AWS_SECRET_ACCESS_KEY as string,
				accessKeyId: AWS_ACCESS_KEY_ID as string,
			},
			region,
		});

		const getObjectResponse = await s3.send(
			new GetObjectCommand({
				Bucket: awsBucket,
				Key: awsKey,
			}),
		);

		if (getObjectResponse.Body) {
			const jsonFileAsText = await getObjectResponse.Body.transformToString();

			return NextResponse.json(
				{ jsonFileAsText },
				{ status: 200, headers: { "Content-Type": "text/plain" } },
			);
		} else {
			return NextResponse.json({ error: "No file found." }, { status: 204 });
		}
	} catch (error) {
		console.error("Error in /api/organizations:get", error);

		return NextResponse.json({ error }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	// 	const token = req.headers.authorization;
	//
	// 	if (!token) {
	// 		return res.status(403).send("An auth token is required.");
	// 	}

	const bodyStream = req.body;

	if (!bodyStream) {
		return NextResponse.json({ error: "No body found." }, { status: 403 });
	}

	const { searchParams } = req.nextUrl;
	const region = searchParams.get("region") || "us-west-1";
	const awsBucket = searchParams.get("aws_bucket");
	const awsKey = searchParams.get("aws_key");

	if (
		!awsBucket ||
		!awsKey ||
		awsBucket === "undefined" ||
		awsKey === "undefined"
	) {
		return NextResponse.json(
			{ error: "aws_bucket and aws_key query params are required." },
			{ status: 403 },
		);
	}

	let bodyBuffer: Buffer;
	try {
		const chunks: Uint8Array[] = [];
		// Iterate over the async iterator of the stream
		// @ts-expect-error => it works
		for await (const chunk of bodyStream) {
			chunks.push(chunk);
		}

		bodyBuffer = Buffer.concat(chunks);
	} catch (error) {
		console.error("Failed to read request body stream into buffer", error);

		return NextResponse.json(
			{
				error: "Failed to process request body",
				details: (error as Error).message,
			},
			{ status: 500 },
		);
	}

	try {
		const s3 = new S3Client({
			credentials: {
				secretAccessKey: AWS_SECRET_ACCESS_KEY as string,
				accessKeyId: AWS_ACCESS_KEY_ID as string,
			},
			region,
		});

		const putObjectCommandResponse = await s3.send(
			new PutObjectCommand({
				// ChecksumAlgorithm: "SHA256",
				ContentLength: bodyBuffer.length,
				ContentType: "text/plain",
				Bucket: awsBucket,
				Key: awsKey,
				Body: bodyBuffer,
			}),
		);

		console.log({ putObjectCommandResponse });

		return NextResponse.json(
			{ message: "File uploaded to AWS successfully" },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Failed to upload file to AWS", error);

		if (
			error instanceof S3ServiceException &&
			error.name === "EntityTooLarge"
		) {
			console.error(
				`Error from S3 while uploading object to ${awsBucket}. \
The object was too large. To upload objects larger than 5GB, use the S3 console (160GB max) \
or the multipart upload API (5TB max).`,
			);
		} else if (error instanceof S3ServiceException) {
			console.error(
				`Error from S3 while uploading object to ${awsBucket}.  ${error.name}: ${error.message}`,
			);
		}

		return NextResponse.json(
			{ error, message: "Failed to upload file" },
			{ status: 500 },
		);
	}
}
