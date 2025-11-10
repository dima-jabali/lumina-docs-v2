import {
	S3Client,
	PutObjectCommand,
	S3ServiceException,
	GetObjectCommand,
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

	const { searchParams } = new URL(req.url);
	const region = searchParams.get("region") || "us-west-1";
	const awsBucket = req.nextUrl.searchParams.get("aws_bucket");
	const awsKey = req.nextUrl.searchParams.get("aws_key");

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
			const bytes = await getObjectResponse.Body.transformToByteArray();
			const fileBase64String = Buffer.from(bytes).toString("base64");

			return NextResponse.json(
				{ fileBase64String },
				{ status: 200, headers: { "Content-Type": "text/plain" } },
			);
		} else {
			return NextResponse.json({ error: "No file found." }, { status: 204 });
		}
	} catch (error) {
		console.error("Error in getAwsFileAsStringBinary", error);

		return NextResponse.json({ error }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	// 	const token = req.headers.authorization;
	//
	// 	if (!token) {
	// 		return res.status(403).send("An auth token is required.");
	// 	}

	const formData = await req.formData();

	// Get the file from the form data
	const file = formData.get("file") as File | null;

	if (!file) {
		return NextResponse.json({ error: "A file is required." }, { status: 400 });
	}

	const { searchParams } = new URL(req.url);
	const region = searchParams.get("region") || "us-west-1";
	const awsBucket = req.nextUrl.searchParams.get("aws_bucket");
	const awsKey = req.nextUrl.searchParams.get("aws_key");

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
		// Read the entire file into a Buffer (or Uint8Array)

		const s3 = new S3Client({
			credentials: {
				secretAccessKey: AWS_SECRET_ACCESS_KEY as string,
				accessKeyId: AWS_ACCESS_KEY_ID as string,
			},
			region,
		});

		console.log({ file });

		const fileBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(fileBuffer);

		const putObjectCommandResponse = await s3.send(
			new PutObjectCommand({
				ContentType: file.type || "application/octet-stream",
				ContentLength: file.size,
				Bucket: awsBucket,
				Body: buffer,
				Key: awsKey,
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
