export type EnquiryEmailData = {
  enquiryType: "general" | "consultation";
  fullName: string;
  phone: string;
  email: string;
  interestedCountry?: string;
  serviceRequired?: string;
  currentQualification?: string;
  interestedCourse?: string;
  message?: string;
  sourcePath?: string;
  submittedAt: string;
};
