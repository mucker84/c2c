import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { app } from "./config";
import type { UserProgress } from "@/types/user";
import type { BonusAnswer } from "@/types/bonus";

export const db = getFirestore(app);

export async function getUserProgress(uid: string): Promise<UserProgress | null> {
  const ref = doc(db, "users", uid, "data", "progress");
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as UserProgress) : null;
}

export async function initUserProgress(uid: string): Promise<UserProgress> {
  const initial: UserProgress = {
    fuel: 0,
    completedLevels: [],
    currentSector: "Core",
    archiveFragments: [],
    updatedAt: null,
  };
  const ref = doc(db, "users", uid, "data", "progress");
  await setDoc(ref, { ...initial, updatedAt: serverTimestamp() });
  return initial;
}

export async function saveLevelResult(
  uid: string,
  levelId: string,
  fuelEarned: number,
  bonusEarned: boolean,
  bonusAnswer?: { question: string; answer: string; levelTitle: string }
) {
  const progressRef = doc(db, "users", uid, "data", "progress");
  const snap = await getDoc(progressRef);
  const current = snap.exists() ? (snap.data() as UserProgress) : null;

  const completedLevels = current?.completedLevels ?? [];
  if (!completedLevels.includes(levelId)) completedLevels.push(levelId);

  await updateDoc(progressRef, {
    fuel: (current?.fuel ?? 0) + fuelEarned,
    completedLevels,
    updatedAt: serverTimestamp(),
  });

  await setDoc(doc(db, "users", uid, "levelResults", levelId), {
    completed: true,
    fuelEarned,
    bonusEarned,
    completedAt: serverTimestamp(),
  });

  if (bonusAnswer) {
    await setDoc(doc(db, "users", uid, "bonusAnswers", levelId), {
      levelId,
      levelTitle: bonusAnswer.levelTitle,
      question: bonusAnswer.question,
      answer: bonusAnswer.answer,
      aiEvaluation: null, // reserved for future AI evaluation
      answeredAt: serverTimestamp(),
    });
  }
}

export async function getBonusAnswers(uid: string): Promise<BonusAnswer[]> {
  const snap = await getDocs(collection(db, "users", uid, "bonusAnswers"));
  return snap.docs.map((d) => d.data() as BonusAnswer);
}
