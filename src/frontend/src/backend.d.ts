import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    classNumber?: bigint;
    name: string;
    phone?: string;
}
export type Time = bigint;
export type ContentId = bigint;
export interface Content {
    id: ContentId;
    title: string;
    classNumber: ClassNumber;
    contentType: ContentType;
    link: string;
    description: string;
    subjectId: SubjectId;
}
export interface Quiz {
    title: string;
    contentId: ContentId;
    questions: Array<Question>;
}
export type Phone = string;
export type ClassNumber = bigint;
export interface Doubt {
    id: bigint;
    classNumber: ClassNumber;
    subjectName: string;
    doubtText: string;
    subjectId: SubjectId;
    timestamp: Time;
    phone: Phone;
    reply?: string;
}
export interface Announcement {
    id: bigint;
    title: string;
    message: string;
    timestamp: Time;
}
export interface Question {
    correctOption: bigint;
    text: string;
    options: Array<string>;
}
export interface Subject {
    id: SubjectId;
    classNumber: ClassNumber;
    name: string;
}
export type SubjectId = bigint;
export interface Student {
    classNumber: ClassNumber;
    name: string;
    phone: Phone;
}
export enum ContentType {
    pdfNotes = "pdfNotes",
    quiz = "quiz",
    recordedClass = "recordedClass",
    liveClass = "liveClass"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAnnouncement(title: string, message: string): Promise<bigint>;
    addContent(classNumber: ClassNumber, subjectId: SubjectId, contentType: ContentType, title: string, link: string, description: string): Promise<ContentId>;
    addQuiz(contentId: ContentId, title: string, questions: Array<Question>): Promise<void>;
    addSubject(classNumber: ClassNumber, name: string): Promise<SubjectId>;
    adminLogin(password: string): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteAnnouncement(id: bigint): Promise<void>;
    deleteContent(id: ContentId): Promise<void>;
    deleteSubject(id: SubjectId): Promise<void>;
    getAllDoubts(): Promise<Array<Doubt>>;
    getAllStudents(): Promise<Array<Student>>;
    getAnnouncements(): Promise<Array<Announcement>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContent(classNumber: ClassNumber, subjectId: SubjectId, contentType: ContentType): Promise<Array<Content>>;
    getMyDoubts(phone: Phone): Promise<Array<Doubt>>;
    getQuiz(contentId: ContentId): Promise<Quiz>;
    getStudent(phone: Phone): Promise<Student>;
    getSubjects(classNumber: ClassNumber): Promise<Array<Subject>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerStudent(phone: Phone, classNumber: ClassNumber): Promise<void>;
    replyDoubt(id: bigint, reply: string): Promise<void>;
    requestOtp(phone: Phone): Promise<string>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitDoubt(phone: Phone, classNumber: ClassNumber, subjectId: SubjectId, subjectName: string, doubtText: string): Promise<void>;
    updateContent(id: ContentId, title: string, link: string, description: string): Promise<void>;
    updateStudentName(phone: Phone, name: string): Promise<void>;
    verifyOtp(phone: Phone, otp: string): Promise<boolean>;
}
