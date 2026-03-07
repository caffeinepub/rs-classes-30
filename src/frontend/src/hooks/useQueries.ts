import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type Content,
  ContentType,
  type Doubt,
  type Quiz,
  type Subject,
} from "../backend.d";
import { useActor } from "./useActor";

// ─── Student Queries ──────────────────────────────────────────────────────────

export function useRequestOtp() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (phone: string) => {
      if (!actor) throw new Error("No actor");
      return actor.requestOtp(phone);
    },
  });
}

export function useVerifyOtp() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({ phone, otp }: { phone: string; otp: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.verifyOtp(phone, otp);
    },
  });
}

export function useRegisterStudent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      phone,
      classNumber,
    }: { phone: string; classNumber: bigint }) => {
      if (!actor) throw new Error("No actor");
      return actor.registerStudent(phone, classNumber);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["student"] });
    },
  });
}

export function useGetStudent(phone: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<{ classNumber: bigint; name: string; phone: string } | null>({
    queryKey: ["student", phone],
    queryFn: async () => {
      if (!actor || !phone) return null;
      try {
        return await actor.getStudent(phone);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!phone,
  });
}

// ─── Subjects ─────────────────────────────────────────────────────────────────

export function useGetSubjects(classNumber: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Subject[]>({
    queryKey: ["subjects", classNumber?.toString()],
    queryFn: async () => {
      if (!actor || classNumber === null) return [];
      return actor.getSubjects(classNumber);
    },
    enabled: !!actor && !isFetching && classNumber !== null,
  });
}

export function useAddSubject() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      classNumber,
      name,
    }: { classNumber: bigint; name: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.addSubject(classNumber, name);
    },
    onSuccess: (_, { classNumber }) => {
      qc.invalidateQueries({ queryKey: ["subjects", classNumber.toString()] });
    },
  });
}

export function useDeleteSubject() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteSubject(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
}

// ─── Content ──────────────────────────────────────────────────────────────────

export function useGetContent(
  classNumber: bigint | null,
  subjectId: bigint | null,
  contentType: ContentType | null,
) {
  const { actor, isFetching } = useActor();
  return useQuery<Content[]>({
    queryKey: [
      "content",
      classNumber?.toString(),
      subjectId?.toString(),
      contentType,
    ],
    queryFn: async () => {
      if (
        !actor ||
        classNumber === null ||
        subjectId === null ||
        contentType === null
      )
        return [];
      return actor.getContent(classNumber, subjectId, contentType);
    },
    enabled:
      !!actor &&
      !isFetching &&
      classNumber !== null &&
      subjectId !== null &&
      contentType !== null,
  });
}

export function useAddContent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      classNumber,
      subjectId,
      contentType,
      title,
      link,
      description,
    }: {
      classNumber: bigint;
      subjectId: bigint;
      contentType: ContentType;
      title: string;
      link: string;
      description: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addContent(
        classNumber,
        subjectId,
        contentType,
        title,
        link,
        description,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["content"] });
    },
  });
}

export function useDeleteContent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteContent(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["content"] });
    },
  });
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

export function useGetQuiz(contentId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Quiz | null>({
    queryKey: ["quiz", contentId?.toString()],
    queryFn: async () => {
      if (!actor || contentId === null) return null;
      try {
        return await actor.getQuiz(contentId);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && contentId !== null,
  });
}

export function useAddQuiz() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      contentId,
      title,
      questions,
    }: {
      contentId: bigint;
      title: string;
      questions: Array<{
        text: string;
        options: string[];
        correctOption: bigint;
      }>;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addQuiz(contentId, title, questions);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["quiz"] });
    },
  });
}

// ─── Doubts ───────────────────────────────────────────────────────────────────

export function useSubmitDoubt() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      phone,
      classNumber,
      subjectId,
      subjectName,
      doubtText,
    }: {
      phone: string;
      classNumber: bigint;
      subjectId: bigint;
      subjectName: string;
      doubtText: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.submitDoubt(
        phone,
        classNumber,
        subjectId,
        subjectName,
        doubtText,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myDoubts"] });
    },
  });
}

export function useGetMyDoubts(phone: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Doubt[]>({
    queryKey: ["myDoubts", phone],
    queryFn: async () => {
      if (!actor || !phone) return [];
      return actor.getMyDoubts(phone);
    },
    enabled: !!actor && !isFetching && !!phone,
  });
}

export function useGetAllDoubts() {
  const { actor, isFetching } = useActor();
  return useQuery<Doubt[]>({
    queryKey: ["allDoubts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDoubts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useReplyDoubt() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reply }: { id: bigint; reply: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.replyDoubt(id, reply);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allDoubts"] });
    },
  });
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export function useAdminLogin() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (password: string) => {
      if (!actor) throw new Error("No actor");
      return actor.adminLogin(password);
    },
  });
}

export { ContentType };
