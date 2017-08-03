import multer from 'multer';

export const storage = multer.diskStorage({
	destination: (req, file, callback) => {
    callback(null, "./public/images");
  },
  filename: (req, file, callback) => {
    callback(null, file.fieldname + "-" + Date.now());
  },
  onFileUploadStart:  (file) => {
    console.log(file.originalname + ' is starting ...');
  },
  onFileUploadComplete: (file) => {
    console.log(file.fieldname + ' uploaded to  ' + file.path);
  }
});