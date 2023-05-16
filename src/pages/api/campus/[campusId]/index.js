import prisma from '@/lib/prisma';
import axios from 'axios';

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { campusId } = req.query;
      let result = await axios.post(
        'https://api.compassdigital.org/v1/user/guest/token',
        {
          realm: 'WEW9lgWk5oTkA98PNGEoc97J9Mdgy6foMM2',
        }
      );
      const { token } = result.data;

      result = await axios.get(
        `https://api.compassdigital.org/v1/location/group/${campusId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { name:campusName, locations } = result.data;
      let data = await Promise.all(locations.map(async(location) => {
        const { brands } = location;
        if (brands.length) {
          const {
            location_description: location,
            name,
            style: { logo: imageUrl },
            menus,
            id,
          } = brands[0];
          // should add average rating
          if (menus.length) {
            let restaurant = await prisma.restaurant.findUnique({
              where: { id }
            })
            if (!restaurant) {
              restaurant = await prisma.restaurant.create({
                data: {
                  id,
                  name,
                  avgRating: 0,
                  campusId,
                  campusName
                },
              });
            }
            return {
              id,
              imageUrl,
              name,
              location,
              menus,
              defaultMenuId: menus[0].id,
              avgRating: restaurant.avgRating,
            };
          }
        }
      }));
      data = data.filter((item) => item !== undefined)
      res.json({
        id: campusId,
        name: campusName,
        Restaurant: data,
      });
    } catch (err) {
      res.status(400).json({
        error: err.message,
      });
    }
  }
}
export default handler;
