import mongoose, { Schema, Document, Types } from 'mongoose';

// Interface for a question
export interface Question {
    _id: Types.ObjectId; // `_id`'yi Types.ObjectId olarak tanımlayın
    question: string;
    time: number;
}

// Interface for a question package
export interface QuestionPackage extends Document {
    title: string;
    questionCount: number;
    questions: Question[];
}

// Mongoose schema for a question
const QuestionSchema: Schema = new Schema<Question>({
    _id: {
        type: Schema.Types.ObjectId, // `_id` alanında Schema.Types.ObjectId kullanın
        required: true,
        default: () => new Types.ObjectId(), // Yeni bir ObjectId otomatik olarak oluşturulacak
    },
    question: {
        type: String,
        required: true,
    },
    time: {
        type: Number,
        required: true,
    },
});

// Mongoose schema for a question package
const QuestionPackageSchema: Schema = new Schema<QuestionPackage>({
    title: {
        type: String,
        required: true,
    },
    questionCount: {
        type: Number,
        required: true,
        default: 0, // This will be updated dynamically when questions are added
    },
    questions: {
        type: [QuestionSchema],
        required: true,
        default: [],
    },
});

// Mongoose model for question packages
export const QuestionPackageModel = mongoose.model<QuestionPackage>('QuestionPackage', QuestionPackageSchema);
