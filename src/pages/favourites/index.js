import { useEffect, useState } from "react"
import { useAuthContext } from "@/contexts/AuthContext"
import axios from "axios"
import { Card, Space, Tag, Typography, List, message } from 'antd';
import { useRouter } from 'next/router';

const { Text } = Typography;
const { Meta } = Card;
export default function Favourites() {
  const router = useRouter();
  const [dishes, setDishes] = useState([]);
  const { authState: {
    user
  }} = useAuthContext()
  useEffect(() => {
    if (user) {
      axios
        .get(`/api/favourites/${user.id}`)
        .then((response) => {
          setDishes(response.data);
        })
        .catch((err) => {
          console.log(error);
        });
    }
    else {
      message.error('please login to view your favorites');
      router.back();
    }
  })
  return (
    <>
      <List
        dataSource={dishes}
        renderItem={(item) => {
          const { id, name, ingredientsDesc, price, calories, cuisine } = item.dish;
          const { restaurant: { name: restaurantName, campus } } = cuisine
          const { name: campusName } = campus
          return (
            <Card key={id} style={{ marginBottom: '5px', width: '60%' }}>
              <Space
                direction='vertical'
                size='middle'
                style={{ display: 'flex' }}
              >
                <Meta title={name} description={ingredientsDesc} />
                <div>
                  <Tag>{calories} Cals</Tag>
                </div>
                <div>
                  <Tag color="red">{`${restaurantName}@${campusName}`}</Tag>
                </div>
                <Text style={{ fontSize: '28px' }}>{price}</Text>
              </Space>
            </Card>
          );
        }}
      />
    </>
  );
}