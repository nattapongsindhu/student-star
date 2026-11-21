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

  it("ENGL 102 has verified Spring 2027 LACCD title and professors", () => {
    const englCourse = getIntelByCourseCode("ENGL 102");
    expect(englCourse).toBeDefined();
    expect(englCourse!.title).toBe("Academic Writing and Literature");
    const profNames = englCourse!.professors.map((p) => p.name);
    expect(profNames).toContain("Darren Borg");
    expect(profNames).toContain("Dylan Altman");
    expect(profNames).toContain("Stella Setka");
    expect(profNames).toContain("Jeffrey Nishimura");
  });

  it("STAT C1000 has verified Spring 2027 professors and deleted all winter ones", () => {
    const statCourse = getIntelByCourseCode("STAT C1000");
    expect(statCourse).toBeDefined();
    const profNames = statCourse!.professors.map((p) => p.name);
    // Verified Spring 2027 professors from City schedule
    expect(profNames).toContain("Kayvon Sarvi");
    expect(profNames).toContain("Hong Kim");
    expect(profNames).toContain("Juliet Salazar");
    expect(profNames).toContain("Raymond Badalian");
    expect(profNames).toContain("Ronald Kendis");
    // Verify Winter-only professors removed from STAT
    expect(profNames).not.toContain("Bret Carthew");
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
