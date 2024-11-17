import { Request, Response } from "express";
import {
  createInterview,
  getInterviewById,
  getAllInterviews,
  deleteInterviewById,
} from "../services/interviewService";
import { QuestionPackageModel } from "../models/question-package.model";
import mongoose from "mongoose";
import InterviewVideosModel from "../models/interviewVideosModel";
import * as VideoService from "../services/videoServices";

// Create Interview Controller
export const createInterviewController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log(req.body);
    const { title, packages, questions, expireDate, canSkip, showAtOnce } =
      req.body;

    if (!title || !expireDate || !packages) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const interviewData = {
      title,
      packages, // Yalnızca ObjectId'leri alıyoruz
      questions,
      expireDate,
      canSkip,
      showAtOnce,
    };

    const newInterview = await createInterview(interviewData);

    const preInterviewVideos = {
      interviewId: newInterview._id,
      videos: [],
    };

    console.log("esas data: " + preInterviewVideos);

    const interviewVideosData = new InterviewVideosModel(preInterviewVideos);
    await interviewVideosData.save();

    res.status(201).json({
      message: "Interview created successfully",
      interview: newInterview,
    });
  } catch (error) {
    console.error("Error creating interview:", error);
    res.status(500).json({ message: "Failed to create interview", error });
  }
};

export const GetInterviewQuestions = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const interview = await getInterviewById(id); // Interview ID ile sorgu

    if (!interview) {
      res.status(404).json({ message: "Interview not found" });
      return;
    }
    console.log(interview.packages);

    // Tüm question package'leri al
    const questions = await Promise.all(
      interview.packages.map(async (pkgId) => {
        const questionPackage = await QuestionPackageModel.findById(
          pkgId.packageId
        ); // Package ID ile sorgu

        return questionPackage?.questions.map((question) => ({
          question: question.question,
          time: question.time,
          packageTitle: questionPackage.title,
        }));
      })
    );

    const flattenedQuestions = questions.flat(); // Paketleri düzleştir
    const extraQuestions = interview.questions || []; // Interview ile gelen ekstra sorular
    const allQuestions = [...flattenedQuestions, ...extraQuestions];

    res
      .status(200)
      .json({ message: "Questions fetched", questions: allQuestions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a single interview by ID
export const getInterviewController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const interview = await getInterviewById(id);

    if (!interview) {
      res.status(404).json({ message: "Interview not found" });
      return;
    }

    res.status(200).json(interview);
  } catch (error) {
    console.error("Error fetching interview:", error);
    res.status(500).json({ message: "Failed to fetch interview", error });
  }
};

// Get all interviews
export const getInterviewsController = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const interviews = await getAllInterviews();
    res.status(200).json(interviews);
  } catch (error) {
    console.error("Error fetching interviews:", error);
    res.status(500).json({ message: "Failed to fetch interviews", error });
  }
};

// Delete a single interview by ID
export const deleteInterviewController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedInterview = await deleteInterviewById(id);

    if (!deletedInterview) {
      res.status(404).json({ message: "Interview not found" });
      return;
    }

    await VideoService.deleteVideo(id);

    res.status(200).json({
      message: "Interview deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting interview:", error);
    res.status(500).json({ message: "Failed to delete interview", error });
  }
};
