import { Card, Space, Tag, Typography, List, message } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useAuthContext } from '@/contexts/AuthContext';
import { axiosInstance } from '@/api-config';
import { useEffect, useState } from 'react';

const { Text } = Typography;
const { Meta } = Card;
const FoodItemsList = ({ restaurantId, items, favourites = [] }) => {
  const {
    authState: { user },
  } = useAuthContext();
  const [localFavourites, setLocalFavourites] = useState(favourites);

  useEffect(() => {
    setLocalFavourites(favourites);
  }, [favourites]);
  const handleFavourite = (item) => {
    if (user) {
      axiosInstance
        .post('/api/favourites', {
          restaurantId,
          dish: item,
          dishId: item.id,
        })
        .then((res) => {
          setLocalFavourites([
            ...localFavourites,
            {
              id: res.data.id,
              custId: res.data.custId,
              dishId: res.data.dishId,
              restaurantId: res.data.restaurantId
            }
          ]);
          message.success('Success !');
        })
        .catch((err) => {
          message.error(
            err?.response?.data?.error ||
              'something went wrong, please try again'
          );
        });
    } else {
      message.error('Please login to favourite a dish');
    }
  };
  const handleRemoveFavourite = (item) => {
    axiosInstance
      .delete(`/api/favourites/${item.id}`)
      .then(() => {
        setLocalFavourites(
          localFavourites.filter((ele) => ele.dishId !== item.dishId)
        );
        message.success('Removed favourite');
      })
      .catch((err) => {
        message.error('Something went wrong, please try again');
      });
  };
  console.log(localFavourites, 'favs');
  return (
    <List
      dataSource={items}
      renderItem={(item) => {
        const {
          id,
          label: { en: name },
          description: { en: ingredientsDesc },
          price,
          nutrition: { calories },
        } = item;
        const elements = localFavourites.filter((ele) => ele.dishId === id)
        return (
          <Card key={id} style={{ marginBottom: '5px' }}>
            <Space
              direction='vertical'
              size='middle'
              style={{ display: 'flex' }}
            >
              <Meta title={name} description={ingredientsDesc} />
              <div>
                <Tag>
                  {calories.amount > 0
                    ? `${calories.amount} Cals`
                    : `Unknown Cals`}
                </Tag>
                { elements.length ? (
                  <HeartFilled onClick={() => handleRemoveFavourite(elements[0])} />
                ) : (
                  <HeartOutlined onClick={() => handleFavourite(item)} />
                )}
              </div>
              <Text style={{ fontSize: '28px' }}>{price.amount}</Text>
            </Space>
          </Card>
        );
      }}
    />
  );
};

export default FoodItemsList;
