export interface StudentData{
  studentId: number,
  firstName: string,
  lastName: string,
  dateOfBirth: Date,
  studentClass: StudentClass,
  studentStatus: string,
  score: number,
  studentPassportPhoto: string,
  studentIDFrontPhoto: string,
  studentIDBackPhoto: string
};

export interface CreateStudentData{
  studentId: number,
  firstName: string,
  lastName: string,
  dateOfBirth: Date,
  studentClass: StudentClass,
  studentStatus: string,
  score: number,
  passportPhotoUrl: File,
  frontIDPhotoUrl: File,
  backIDPhotoUrl: File
};

export interface StudentClass{
    name: string,
    definition: string
};
