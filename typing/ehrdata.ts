interface _EHRData {
    name: {
      prefix: string;      // Title or honorific
      firstname: string;   // First name
      surname: string;     // Last name
    };
    age: number;           // Age of the person
    gender: string;        // Gender (e.g., "ชาย" for male, "หญิง" for female)
    chief_complaint: string[];  // Array of chief complaints
    present_illness: string[];  // Array of present illness descriptions
    past_illness: string[];     // Array of past illness conditions
    family_history: {
      relation: string;    // Relation to the person (e.g., "พ่อ", "แม่")
      condition: string;   // Medical condition of the relative
    }[];
    personal_history: {
      type: string;        // Type of personal history (e.g., behavior, medication)
      description: string; // Description of the personal history
    }[];
}

export type EHRData = _EHRData | null;