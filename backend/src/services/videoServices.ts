// services/videoService.ts
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import InterviewVideos from "../models/interviewVideosModel";
import dotenv from "dotenv";
import InterviewModel from "../models/interviewModel";

dotenv.config();

const s3Client = new S3Client({
  region: process.env.VIDEO_API_REGION,
  credentials: {
    accessKeyId: process.env.VIDEO_API_ACCESS_KEY!,
    secretAccessKey: process.env.VIDEO_API_SECRET_KEY!,
  },
});

// Interview ID'ye göre tüm videoları getir
export const fetchVideosByInterviewId = async (interviewId: string) => {
  try {
    const interviewVideos = await InterviewVideos.findOne({ interviewId });

    if (!interviewVideos) {
      throw new Error("Videolar bulunamadı");
    }

    // S3 URL'lerini her video için oluştur
    const videosWithUrls = await Promise.all(
      interviewVideos.videos.map(async (video) => {
        const command = new GetObjectCommand({
          Bucket: process.env.VIDEO_API_BUCKET,
          Key: video.videoKey,
        });
        const signedUrl = await getSignedUrl(s3Client, command, {
          expiresIn: 3600,
        });
        return { ...video.toObject(), s3Url: signedUrl };
      })
    );

    return videosWithUrls;
  } catch (error) {
    throw new Error(
      `Failed to fetch videos by Interview ID: ${(error as Error).message}`
    );
  }
};

export const updateInterviewVideos = async (
  interviewId: string,
  userId: string,
  videoId: string,
  pass: boolean,
  fail: boolean,
  note: string
) => {
  try {
    const interviewVideos = await InterviewVideos.findOne({ interviewId });
    if (!interviewVideos) {
      throw new Error("Interview videos not found");
    }

    const video = interviewVideos.videos.find(
      (video) => video.userId === userId && video.id.toString() === videoId
    );

    if (!video) {
      throw new Error("Video not found for specified userId and videoId");
    }

    const wasPending = !video.pass && !video.fail; // Video eskiden 'pending' mi?
    const isNowPending = !pass && !fail; // Video şimdi 'pending' mi olacak?

    // Video durumunu güncelle
    video.pass = pass;
    video.fail = fail;
    video.note = note;

    await interviewVideos.save();

    if (wasPending && !isNowPending) {
      // Eğer video eskiden 'pending' ise ve artık değilse, pendingVideos'u azalt
      await InterviewModel.findByIdAndUpdate(
        interviewId,
        {
          $inc: { pendingVideos: -1 },
        },
        { new: true }
      );
    } else if (!wasPending && isNowPending) {
      // Eğer video eskiden 'pending' değilse ve şimdi 'pending' olduysa, pendingVideos'u artır
      await InterviewModel.findByIdAndUpdate(
        interviewId,
        {
          $inc: { pendingVideos: 1 },
        },
        { new: true }
      );
    }
  } catch (error) {
    throw new Error(
      `Failed to update interview videos: ${(error as Error).message}`
    );
  }
};


// Tek bir video yükle
export const uploadVideoToAPI = async (
  file: Express.Multer.File,
  userId: string,
  interviewId: string
) => {
  try {
    const randomFileName = `${Date.now()}.mp4`;
    const fileKey = `${interviewId}/${randomFileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.VIDEO_API_BUCKET,
      Key: `${interviewId}/${randomFileName}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentDisposition: "inline",
    });

    const uploadResult = await s3Client.send(command);

    const updatedInterview = await InterviewVideos.findOneAndUpdate(
      { interviewId },
      {
        $push: {
          videos: {
            userId,
            videoKey: fileKey,
          },
        },
      },
      { new: true, upsert: true }
    );

    const videolen = updatedInterview?.videos.length;

    const pendingVideoslen = updatedInterview?.videos.filter(
      (video) => !video.pass && !video.fail
    ).length;

    await InterviewModel.findByIdAndUpdate(
      interviewId,
      { totalVideos: videolen, pendingVideos: pendingVideoslen },
      { new: true }
    );

    return {
      fileKey,
      uploadResult,
      updatedInterview,
    };
  } catch (error) {
    throw new Error(`Failed to upload video: ${(error as Error).message}`);
  }
};

// Belirli bir video sil
// services/videoService.ts

export const deleteVideo = async (interviewId: string) => {
  try {
    console.log(`Deleting all items under interview ID: ${interviewId}`);

    // 1. Listeyi çekin
    const listParams = {
      Bucket: process.env.VIDEO_API_BUCKET, // BUCKET_NAME yerine sizin kullandığınız bucket key
      Prefix: `${interviewId}/`, // interviewId dizinini prefix olarak belirtiyoruz
    };
    const listedObjects = await s3Client.send(
      new ListObjectsV2Command(listParams)
    );

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
      console.log("Folder is empty or does not exist.");
      return;
    }

    // 2. Her bir dosya için silme işlemi
    const deletePromises = listedObjects.Contents.map(({ Key }) =>
      s3Client.send(
        new DeleteObjectCommand({ Bucket: process.env.VIDEO_API_BUCKET, Key })
      )
    );

    await Promise.all(deletePromises);

    console.log(
      `All videos under interview ID ${interviewId} deleted successfully.`
    );
  } catch (error) {
    console.error("Error deleting videos from S3:", error);
    throw error;
  }
};
