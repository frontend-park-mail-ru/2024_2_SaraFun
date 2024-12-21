import { postFormData } from '../../../shared/api/api';
import { ImgData } from '../lib/profile';

export async function uploadImg(imagesNew: ImgData[], imagesURLs: string[], imagesIndexes: number[]): Promise<boolean> {
    try {
        for (const image of imagesNew) {
            const formData = new FormData();
            formData.append('image', image.file);
            formData.append('number', String(image.index + 1));
            const response = await postFormData('/api/uploadimage', formData);
            if (!response.ok) {
              //console.error('Failed to upload the image:', response.statusText);
              return false; 
            };

            const data = await response.json(); 

            imagesURLs[image.index] = data.link;
            imagesIndexes[image.index] = data.id;
        }
        return true;
    }
    catch(error) {
        //console.error('Error uploading the image:', error);
        return false; 
    }
};

