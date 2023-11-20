import { createUploadthing } from 'uploadthing/express';

const f = createUploadthing();

export const uploadRouter = {
  image: f({
    image: {
      maxFileSize: '1MB'
    }
  }).onUploadComplete((data) => {
    console.log(data);
  })
}