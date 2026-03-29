import { useEffect, useState } from "react";
import bannerService from "../services/banner";

const Banner = () => {

  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await bannerService.getAllBanners();
        setBanners(data.banners);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };
    fetchBanners();
  }, []);

  return (
    <>
      <div className="m-2 p-2 pt-8 pr-4 pl-4 flex flex-col justify-center items-center md:items-start md:justify-start">
        <h2 className="text-xl font-sans font-bold mb-4 text-center md:text-left">
          POCO M8 5G Online Coming
        </h2>

        {banners.map((banner) => (
          <img
            key={banner._id}
            src={`${import.meta.env.VITE_IMAGE_URL}${banner.image}`}
            alt={banner.title}
            className="w-full h-auto"
          />
        ))}
      </div>
    </>

  )
}

export default Banner