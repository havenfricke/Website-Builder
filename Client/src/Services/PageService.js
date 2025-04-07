import { AppState } from "../AppState";
import { Page } from "../Models/Page";
import { api } from "./AxiosService";

class PageService 
{
    // READ
    async getAllPages()
    {
        AppState.pages = []
        const response = await api.get('/pages');
        console.log('[GET PAGE]', response.data);
        AppState.pages = response.data.data.map(page => new Page(page));
    }

    // READ BY ID
    async getPageByID(id)
    {
        const response = await api.get(`/pages/${id}`);
        console.log('[GET PAGE BY ID]', response.data);
        AppState.activePage = response.data;
    }
}

export const pageService = new PageService();