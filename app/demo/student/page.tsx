import type { Metadata } from "next";
import { StudentDashboard } from "@/components/student/StudentDashboard";

export const metadata: Metadata = { title: "Student dashboard · Fluently demo" };

export default function StudentDemoPage() {
  return <StudentDashboard />;
}
