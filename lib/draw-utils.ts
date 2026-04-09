/**
 * Draw utility functions for lucky draw application
 */

export const DRAW_ANIMATION_SPEED = 50 // ms between selections
export const TOTAL_SELECTIONS = 30 // number of random selections before final winner

export function selectRandomStudent(students: string[]): string {
  if (students.length === 0) throw new Error("No students available for selection")
  return students[Math.floor(Math.random() * students.length)]
}

export function getAvailableStudents(
  filteredStudents: string[],
  winners: string[],
  excludePreviousWinners: boolean
): string[] {
  if (!excludePreviousWinners) {
    return filteredStudents
  }

  return filteredStudents.filter((name) => !winners.includes(name))
}
