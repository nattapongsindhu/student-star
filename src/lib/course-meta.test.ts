import { describe, expect, it } from "vitest";
import { instructorFor } from "./course-meta";
import { seedCourses } from "./semester";

describe("course metadata helpers", () => {
  it("shows verified instructors for Canvas-backed courses", () => {
    const pols = courseById("pols-c1000");
    const cis166 = courseById("cis-166");
    const cis162 = courseById("cis-162");

    expect(instructorFor(pols)).toBe("Anika Toussant");
    expect(instructorFor(cis166)).toBe("Allan Pratt");
    expect(instructorFor(cis162)).toBe("Ray Lampano, Jr.");
  });
});

function courseById(id: string) {
  const course = seedCourses.find((item) => item.id === id);
  if (!course) throw new Error(`Missing seed course: ${id}`);
  return course;
}
