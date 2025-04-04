import { AppState } from "../AppState";
import { Page } from "../Models/Page";
import { api } from "./AxiosService";

class PageService 
{
    // READ
    async getAllPages()
    {
        AppState.pageArray = []
        const response = await api.get('/pages');
        console.log('get pages', response.data);
        AppState.pageArray = response.data.data.map(page => new Page(page));
    }

    // READ BY ID
    async getPageByID(id)
    {
        const response = await api.get(`/pages/${id}`);
        console.log('get exmaple by id', response.data);
        AppState.activePage = response.data;
    }
}

export const pageService = new PageService();