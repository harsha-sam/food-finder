import prisma from '@/lib/prisma';
import axios from 'axios';
import clientPromise from '@/lib/db';
import jwt from 'jsonwebtoken';

const verifyToken = async (token, tokenSecret) => {
  return jwt.verify(token, tokenSecret, async (error, payload) => {
    let user = null;
    if (error) {
      // throw error;
    } else {
      const client = await clientPromise;
      const db = await client.db();
      user = await db.collection('users').findOne({
        email: payload.email,
      });
      user.id = user._id;
    }
    return user;
  });
};

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const user = await verifyToken(
        req.headers['access-token'],
        process.env.ACCESS_TOKEN_SECRET
      );
      const { campusId, restaurantId } = req.query;
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
      let selectedBrand = {};
      const { name: campusName, locations } = result.data;
      for (const location of locations) {
        const { brands } = location;
        if (brands.length) {
          const {
            location_description: location,
            name,
            style: { logo: imageUrl },
            menus,
            id,
          } = brands[0];
          if (restaurantId === id) {
            let avgRating = 0;
            const restaurant = await prisma.restaurant.findUnique({
              where: {
                id: restaurantId,
              },
            });
            if (restaurant) {
              avgRating = restaurant.avgRating;
            }
            // should add costestimate and average rating
            if (menus.length) {
              selectedBrand = {
                id,
                imageUrl,
                name,
                location,
                defaultMenuId: menus[0].id,
                costEstimate: '$',
                avgRating,
              };
            }
            break;
          }
        }
      }
      if (selectedBrand) {
        const restaurantData = await axios.get(
          `https://api.compassdigital.org/v1/menu/${selectedBrand.defaultMenuId}?nclude_brands_config=true&nocache=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        let myRating = 0;
        if (user) {
          const userRating = await prisma.rating.findUnique({
            where: {
              customer_rating: {
                custId: user.id.toString(),
                restaurantId,
              },
            },
          });
          if (!userRating) {
            myRating = 0;
          } else {
            myRating = userRating.rating;
          }
        }
        const reviews = await prisma.reviews.findMany({
          where: {
            restaurantId,
          },
        });
        const favourites = await prisma.favourite.findMany({
          where: {
            custId: user.id.toString(),
            restaurantId,
          },
          select: {
            id: true,
            custId: true,
            dishId: true,
            restaurantId: true
          },
        });
        const { groups } = restaurantData.data;
        res.json({
          ...selectedBrand,
          groups,
          reviews,
          myRating,
          campus: {
            campusId,
            campusName
          },
          favourites
        });
      }
    } catch (err) {
      res.status(400).json({
        error: err.message,
      });
    }
  }
}
export default handler;
