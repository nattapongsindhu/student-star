import { describe, expect, it } from "vitest";
import { classTypeLinesFor, compactCourseTitleFor, instructorFor, professorRatingLineFor, sourceProofFor } from "./course-meta";
import { seedCourses } from "./semester";

describe("course metadata helpers", () => {
  it("shows verified instructors for Canvas-backed courses", () => {
    const pols = courseById("pols-c1000");
    const cis210 = courseById("cis-210");
    const anthro102 = courseById("anthro-102");
    const cs101 = courseById("cs-101");
    const englC1000 = courseById("engl-c1000");
    const health101 = courseById("health-101");
    const cis166 = courseById("cis-166");
    const cis162 = courseById("cis-162");

    expect(instructorFor(pols)).toBe("Anika Toussant");
    expect(instructorFor(cis210)).toBe("Mike Yazdanian");
    expect(instructorFor(anthro102)).toBe("Brian Bartelt");
    expect(instructorFor(cs101)).toBe("Pamela Atkinson");
    expect(instructorFor(englC1000)).toBe("Kylowna Moton");
    expect(instructorFor(health101)).toBe("Tracy Harkins");
    expect(instructorFor(cis166)).toBe("Allan Pratt");
    expect(instructorFor(cis162)).toBe("Raynaldo Lampano");
    expect(instructorFor(courseById("asian-001"))).toBe("Katie Bui");
    expect(instructorFor(courseById("cis-112"))).toBe("Mike Yazdanian");
    expect(instructorFor(courseById("co-tech-002"))).toBe("Mike Yazdanian");
    expect(instructorFor(courseById("cis-212"))).toBe("Mike Yazdanian");
    expect(instructorFor(courseById("cis-213"))).toBe("Mike Yazdanian");
    expect(instructorFor(courseById("cis-211"))).toBe("Allan Pratt");
    expect(instructorFor(courseById("cis-170"))).toBe("Raynaldo Lampano");
    expect(instructorFor(courseById("cis-191"))).toBe("Andrea Loney");
    expect(instructorFor(courseById("cs-119"))).toBe("Mohammed Abdelrahim");
    expect(instructorFor(courseById("cis-214"))).toBe("Farahnaz Nezhad");
  });

  it("uses compact course titles in dense course tables", () => {
    expect(compactCourseTitleFor(courseById("engl-c1000"))).toBe("Academic Rd&Wr");
    expect(compactCourseTitleFor(courseById("cis-210"))).toBe("Intro to Comp Network");
    expect(compactCourseTitleFor(courseById("cis-112"))).toBe("OS: Beginning Linux");
  });

  it("formats class type details as stacked lines", () => {
    expect(classTypeLinesFor(courseById("cis-112"))).toEqual(["Campus", "Thu 14:30-17:40"]);
    expect(classTypeLinesFor(courseById("cis-210"))).toEqual(["Online", "Mon/Wed 09:00-11:00"]);
    expect(classTypeLinesFor(courseById("cis-166"))).toEqual(["Online", "Mon/Wed 11:00-12:15"]);
    expect(classTypeLinesFor(courseById("anthro-102"))).toEqual(["Campus", "Wed 14:20-15:45"]);
    expect(classTypeLinesFor(courseById("engl-c1000"))).toEqual(["Online", "Wed 18:50-22:00"]);
    expect(classTypeLinesFor(courseById("cis-162"))).toEqual(["Online", "Sat 14:00-18:00"]);
    expect(classTypeLinesFor(courseById("pols-c1000"))).toEqual(["Online", "(Asynchronous)"]);
    expect(classTypeLinesFor(courseById("health-101"))).toEqual(["Online", "(Asynchronous)"]);
    expect(classTypeLinesFor(courseById("cis-214"))).toEqual(["Online", "(Asynchronous)"]);
    expect(classTypeLinesFor(courseById("cs-119"))).toEqual(["Online", "(Asynchronous)"]);
    expect(classTypeLinesFor(courseById("co-tech-002"))).toEqual([
      "Planned course from Student Educational Plan",
      "schedule TBA",
    ]);
  });

  it("does not show the old unsynced instructor placeholder", () => {
    const oldPlaceholder = ["Instructor", "not", "synced", "yet"].join(" ");

    seedCourses.forEach((course) => {
      expect(instructorFor(course)).not.toBe(oldPlaceholder);
    });
  });

  it("shows RateMyProfessors context for verified professor matches", () => {
    expect(professorRatingLineFor(courseById("cis-112"))).toBe("RMP 4.2/5 · 5 reviews");
    expect(professorRatingLineFor(courseById("health-101"))).toBe("RMP 4.8/5 · 6 reviews");
    expect(professorRatingLineFor(courseById("cis-191"))).toBe("RMP 5.0/5 · 3 reviews");
  });

  it("keeps RateMyProfessors pending when the match is not verified enough", () => {
    expect(professorRatingLineFor(courseById("asian-001"))).toBe("RMP pending");
    expect(professorRatingLineFor(courseById("pols-c1000"))).toBe("RMP pending");
  });

  it("shows source proof for verified course details", () => {
    expect(sourceProofFor(courseById("cis-210"))).toContain("Syllabus PDF");
    expect(sourceProofFor(courseById("health-101"))).toContain("Canvas modules/grades PDFs");
    expect(sourceProofFor(courseById("engl-c1000"))).toContain("Course roster PDF");
    expect(sourceProofFor(courseById("pols-c1000"))).toContain("SIS course history screenshot");
    expect(sourceProofFor(courseById("cis-162"))).toContain("Saturday Zoom schedule");
    expect(sourceProofFor(courseById("cis-166"))).toContain("Mon/Wed Zoom schedule");
  });
});

function courseById(id: string) {
  const course = seedCourses.find((item) => item.id === id);
  if (!course) throw new Error(`Missing seed course: ${id}`);
  return course;
}
