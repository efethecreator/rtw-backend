import { QuestionPackageModel, QuestionPackage, Question, } from '../models/question-package.model'; // Şemanın bulunduğu yer
import mongoose, { Types } from 'mongoose';

class QuestionPackageService {
    // Soru paketi oluşturma
    async createQuestionPackage(title: string): Promise<QuestionPackage> {
        const newPackage = new QuestionPackageModel({
            title,
            questionCount: 0,
            questions: [],
        });
        return await newPackage.save();
    }

    async deleteQuestionFromPackage(packageId: string, questionId: string): Promise<QuestionPackage | null> {
        const questionPackage = await QuestionPackageModel.findById(packageId);
        if (!questionPackage) {
            throw new Error('Question package not found');
        }
    
        // Soru listesinde filtreleme yaparak soruyu çıkar
        questionPackage.questions = questionPackage.questions.filter(
            (question) => question._id.toString() !== questionId
        );
        questionPackage.questionCount = questionPackage.questions.length;
    
        return await questionPackage.save();
    }

    // Soru ekleme
    async addQuestion(packageId: string, question: string, time: number): Promise<QuestionPackage | null> {
        const questionPackage = await QuestionPackageModel.findById(packageId);
        if (!questionPackage) {
            throw new Error('Question package not found');
        }
    
        // Yeni soruya manuel olarak _id ekleyin
        questionPackage.questions.push({ _id: new Types.ObjectId(), question, time });
        questionPackage.questionCount = questionPackage.questions.length; // Soru sayısını güncelle
    
        return await questionPackage.save();
    }

    // Soru paketini silme
    async deletePackage(packageId: string): Promise<QuestionPackage | null> {
        const deletedPackage = await QuestionPackageModel.findByIdAndDelete(packageId);
        return deletedPackage; // Eğer silinemezse null döner
    }

    // Tüm soru paketlerini listeleme
    async getAllPackages(): Promise<QuestionPackage[]> {
        return await QuestionPackageModel.find();
    }

    // Tek bir soru paketini getirme
    async getPackageById(packageId: string): Promise<QuestionPackage | null> {
        return await QuestionPackageModel.findById(packageId);
    }

    // Soru paketini güncelleme
    async updatePackage(packageId: string, title?: string, questions?: Question[]): Promise<QuestionPackage | null> {
        const questionPackage = await QuestionPackageModel.findById(packageId);
        if (!questionPackage) {
            throw new Error('Question package not found');
        }

        // Gelen verilerle güncellemeyi gerçekleştir
        if (title) {
            questionPackage.title = title;
        }
        if (questions) {
            questionPackage.questions = questions;
            questionPackage.questionCount = questions.length; // Soru sayısını günceller
        }

        // Güncellenmiş paketi kaydet ve geri döndür
        return await questionPackage.save();
    }

    // Paketten tekil soru silme



}

export const questionPackageService = new QuestionPackageService();
