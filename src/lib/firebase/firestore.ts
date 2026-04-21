import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { app } from "./config";
import type { UserProgress } from "@/types/user";

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
  bonusEarned: boolean
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
}
