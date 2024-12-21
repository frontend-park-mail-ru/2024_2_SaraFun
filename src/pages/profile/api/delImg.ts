import {del} from '../../../shared/api/api';

export async function delImg(imagesDel: number[]): Promise<boolean> {
    try {
        for (const imageId of imagesDel) {
            if (imageId === -1) {
              continue;
            }
            const response = await del(`/api/image/${imageId}`);
            if (!response.ok) {
              //console.error('Failed to delete the image:', response.statusText);
              return false; 
            }
        }
        return true;
    }
    catch(error) {
        //console.error('Error deleting the image:', error);
        return false; 
    }
};

