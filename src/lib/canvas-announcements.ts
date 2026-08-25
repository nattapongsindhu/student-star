import type { Course } from "./semester";

export type CanvasAnnouncement = {
  id: number;
  courseCode: string;
  postedAt: string | null;
  title: string;
  url: string | null;
  summary: string;
};

type CanvasAnnouncementResponse = {
  id: number;
  title?: string;
  message?: string | null;
  posted_at?: string | null;
  delayed_post_at?: string | null;
  html_url?: string | null;
  context_code?: string;
};

function stripHtml(value: string | null | undefined) {
  if (!value) return "No announcement details provided.";
  return value
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 260);
}

export async function getCanvasAnnouncements(courses: Course[]): Promise<CanvasAnnouncement[]> {
  const baseUrl = process.env.CANVAS_BASE_URL?.replace(/\/$/, "");
  const token = process.env.CANVAS_ACCESS_TOKEN;
  const canvasCourses = courses.filter((course) => course.canvas_course_id !== null);

  if (!baseUrl || !token || canvasCourses.length === 0) {
    return [];
  }

  const courseByContextCode = new Map(canvasCourses.map((course) => [`course_${course.canvas_course_id}`, course]));
  const params = new URLSearchParams({
    active_only: "true",
    per_page: "10",
  });

  for (const course of canvasCourses) {
    params.append("context_codes[]", `course_${course.canvas_course_id}`);
  }

  try {
    const response = await fetch(`${baseUrl}/api/v1/announcements?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: {
        revalidate: 900,
      },
    });

    if (!response.ok) {
      return [];
    }

    const rows = (await response.json()) as CanvasAnnouncementResponse[];
    return rows
      .map((announcement) => {
        const course = announcement.context_code ? courseByContextCode.get(announcement.context_code) : undefined;
        return {
          id: announcement.id,
          courseCode: course?.code ?? "Canvas",
          postedAt: announcement.posted_at ?? announcement.delayed_post_at ?? null,
          title: announcement.title ?? "Untitled announcement",
          url: announcement.html_url ?? null,
          summary: stripHtml(announcement.message),
        };
      })
      .sort((a, b) => {
        if (!a.postedAt && !b.postedAt) return 0;
        if (!a.postedAt) return 1;
        if (!b.postedAt) return -1;
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      })
      .slice(0, 3);
  } catch {
    return [];
  }
}
