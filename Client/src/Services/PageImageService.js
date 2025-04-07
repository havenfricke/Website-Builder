import { AppState } from "../AppState";
import { PageImage } from "../Models/PageImage";
import { api } from "./AxiosService";

class PageImageService {
  // READ
  async getAllPageImages(pageId) {
    AppState.pageImages = [];
    const response = await api.get(`/page-images/${pageId}`);
    console.log('[GET PAGE IMAGES]', response.data);
    AppState.pageImages = response.data.data.map(page => new PageImage(page));
  }
}

export const pageImageService = new PageImageService();