import { axiosInstance } from '@/api-config';
import { useAuthContext } from '@/contexts/AuthContext';
import { HeartFilled } from '@ant-design/icons';
import { Card, List, Space, Tag, Typography, Spin, message } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const { Text } = Typography;
const { Meta } = Card;
export default function Favourites() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [dishes, setDishes] = useState([]);
  const {
    authState: { user },
  } = useAuthContext();
  useEffect(() => {
    if (user) {
      axiosInstance
        .get(`/api/favourites`)
        .then((response) => {
          setDishes(response.data);
        })
        .catch((err) => {
          console.log(error);
        })
    } 
    setIsLoading(false)
  }, [user, router]);
  const handleRemoveFavourite = (id) => {
    setIsLoading(true);
    axiosInstance
      .delete(`/api/favourites/${id}`)
      .then(() => {
        setDishes(dishes.filter((d) => d.id !== id));
        setIsLoading(false);
        message.success('Removed favourite');
      })
      .catch((err) => {
        message.error('Something went wrong, please try again');
        setIsLoading(false);
      })
  };
  if (isLoading) {
    return (
      <Spin
        tip='Loading...'
        style={{ marginLeft: 'auto', width: '100%', marginTop: '20px' }}
      ></Spin>
    );
  }
  else {
    return (
      <>
        <List
          dataSource={dishes}
          renderItem={(item) => {
            const { restaurant, dish } = item;
            const {
              id,
              label: { en: name },
              description: { en: ingredientsDesc },
              price,
              nutrition: { calories },
            } = dish;
            const {
              id: restaurantId,
              name: restaurantName,
              campusId,
              campusName,
            } = restaurant;
            return (
              <Card key={id} style={{ marginBottom: '5px', width: '60%' }}>
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
                  </div>
                  <div>
                    <Tag color='red'>{`${restaurantName}@${campusName}`}</Tag>
                    <HeartFilled onClick={() => handleRemoveFavourite(item.id)} />
                  </div>
                  <Text style={{ fontSize: '28px' }}>{price.amount}</Text>
                </Space>
              </Card>
            );
          }}
        />
      </>
    );
  }
}
