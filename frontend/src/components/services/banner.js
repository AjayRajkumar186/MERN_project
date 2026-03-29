import api from "./api";

const bannerService = {
    getAllBanners: async () => {
        const response = await api.get("/banners");
        return response.data;
    },
};

export default bannerService;