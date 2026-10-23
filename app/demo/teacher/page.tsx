import type { Metadata } from "next";
import { TeacherDashboard } from "@/components/teacher/TeacherDashboard";

export const metadata: Metadata = { title: "Teacher dashboard · Fluently demo" };

export default function TeacherDemoPage() {
  return <TeacherDashboard />;
}
