export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ENTRIES: FaqEntry[] = [
  {
    id: "dean-office",
    question: "Where is the Dean's office?",
    answer:
      "Main Building, 2nd floor, room 205. Office hours: Mon–Fri, 9:00–17:00.",
  },
  {
    id: "ects",
    question: "What is the ECTS?",
    answer:
      "European Credit Transfer System — a standard way to measure course workload. 1 ECTS credit ≈ 25–30 hours of study.",
  },
  {
    id: "d116",
    question: "Where is the D116?",
    answer:
      "Block D, 1st floor, next to the main entrance. Follow the signs from the D-block lobby.",
  },
  {
    id: "course-registration",
    question: "How do I register for courses?",
    answer:
      'Log in to the student portal → "Course Registration" tab → select your semester → choose courses → confirm.',
  },
  {
    id: "library",
    question: "Where is the library?",
    answer:
      "Library, Block C, 3rd floor. Open 8:00–22:00 on weekdays, 10:00–18:00 on weekends.",
  },
];
