import { describe, expect, it } from "vitest";
import { getIntelByCourseCode, professorIntelCourses } from "./professor-intel";

describe("professor intel dataset", () => {
  it("includes all 10 planned high-stakes courses", () => {
    const codes = professorIntelCourses.map((c) => c.code);
    expect(codes).toContain("MATH 260");
    expect(codes).toContain("MATH 261");
    expect(codes).toContain("MATH 262");
    expect(codes).toContain("MATH 263");
    expect(codes).toContain("MATH 275");
    expect(codes).toContain("PHYS 101");
    expect(codes).toContain("PHYS 102");
    expect(codes).toContain("ENGL 102");
    expect(codes).toContain("CHEM 101");
    expect(codes).toContain("STAT C1000");
  });

  it("does not include deleted ENGL C1001", () => {
    const codes = professorIntelCourses.map((c) => c.code);
    expect(codes).not.toContain("ENGL C1001");
  });

  it("STAT C1000 has verified LACCD professors and does not include outside names", () => {
    const statCourse = getIntelByCourseCode("STAT C1000");
    expect(statCourse).toBeDefined();
    const profNames = statCourse!.professors.map((p) => p.name);
    // Verified LACCD professors from schedule
    expect(profNames).toContain("Bret Carthew");
    expect(profNames).toContain("Kee Lam");
    expect(profNames).toContain("Angela Chung");
    expect(profNames).toContain("Zachary Brown");
    expect(profNames).toContain("Kayvon Sarvi");
    // Verify non-LACCD name removed
    expect(profNames).not.toContain("Ruzanna Mardirosian");
  });

  it("has valid rating and difficulty ranges for all professors", () => {
    for (const course of professorIntelCourses) {
      expect(course.professors.length).toBeGreaterThan(0);
      for (const prof of course.professors) {
        expect(prof.overallRating).toBeGreaterThanOrEqual(1.0);
        expect(prof.overallRating).toBeLessThanOrEqual(5.0);
        expect(prof.difficulty).toBeGreaterThanOrEqual(1.0);
        expect(prof.difficulty).toBeLessThanOrEqual(5.0);
        expect(prof.rmpUrl).toContain("ratemyprofessors.com");
        expect(prof.campus).toBeDefined();
      }
    }
  });

  it("finds course intel case-insensitively with flexible spacing", () => {
    expect(getIntelByCourseCode("math 260")?.code).toBe("MATH 260");
    expect(getIntelByCourseCode("MATH261")?.code).toBe("MATH 261");
    expect(getIntelByCourseCode("stat c1000")?.code).toBe("STAT C1000");
  });
});
