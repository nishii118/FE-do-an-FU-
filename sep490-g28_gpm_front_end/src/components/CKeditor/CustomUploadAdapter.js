// CustomUploadAdapter.js
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/firebaseConfig";

class CustomUploadAdapter {
    constructor(loader, uploadedImages) {
      this.loader = loader;
      this.uploadedImages = uploadedImages;
    }
  
    upload() {
      return this.loader.file.then(file =>
        new Promise((resolve, reject) => {
          const storageRef = ref(storage, `ck-editor/${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file);
          uploadTask.on(
            'state_changed',
            snapshot => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
            },
            error => {
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
                this.uploadedImages.push(downloadURL);  // Track uploaded image URL
                resolve({ default: downloadURL });
              });
            }
          );
        })
      );
    }
  
    abort() {
      if (this.uploadTask) {
        this.uploadTask.cancel();
      }
    }
  }
  
export default CustomUploadAdapter;