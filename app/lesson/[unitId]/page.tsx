import { notFound } from "next/navigation";

import { LessonShell } from "@/components/lesson-shell";
import { getLearningUnit } from "@/data/learning-units";

type LessonPageProps = {
  params: Promise<{ unitId: string }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { unitId } = await params;
  const unit = getLearningUnit(unitId);
  if (!unit) notFound();

  return <LessonShell unit={unit} />;
}
