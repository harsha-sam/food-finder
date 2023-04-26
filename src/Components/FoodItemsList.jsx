import { Card, Space, Tag, Typography, List, message } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useAuthContext } from '@/contexts/AuthContext';
import axios from 'axios';

const { Text } = Typography;
const { Meta } = Card;
const FoodItemsList = ({ items }) => {
  const {
    authState: {
      user
    }
  } = useAuthContext();
  const handleFavourite = (id) => {
    if (user) {
      axios
        .post('/api/favourites', {
          custId: user.id,
          dishId: id,
        })
        .then(() => {
          message.success('Success !');
        })
        .catch((err) => {
          message.error(
            err?.response?.data?.error ||
              'something went wrong, please try again'
          );
        });
    }
    else {
      message.error('Please login to favourite a dish');
    }
  }
  return (
    <List
      dataSource={items}
      renderItem={(item) => {
        const { id, name, ingredientsDesc, price, calories } = item;
        return (
          <Card key={id} style={{ marginBottom: '5px' }}>
            <Space
              direction='vertical'
              size='middle'
              style={{ display: 'flex' }}
            >
              <Meta title={name} description={ingredientsDesc} />
              <div>
                <Tag>{calories} Cals</Tag>
                <HeartOutlined onClick={() => handleFavourite(id)}/>
              </div>
              <Text style={{ fontSize: '28px' }}>{price}</Text>
            </Space>
          </Card>
        );
      }}
    />
  );
};

export default FoodItemsList;
