import { describe, expect, it } from "vitest";
import { instructorFor } from "./course-meta";
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
    expect(instructorFor(cis162)).toBe("Ray Lampano, Jr.");
  });
});

function courseById(id: string) {
  const course = seedCourses.find((item) => item.id === id);
  if (!course) throw new Error(`Missing seed course: ${id}`);
  return course;
}
