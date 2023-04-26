import { Card, Typography, Rate, Tag, Space } from 'antd';
const { Text } = Typography;
const { Meta } = Card;
const RestaurantCard = ({
  imageUrl: coverImg,
  name,
  runningHours,
  location,
  costEstimate,
  avgRating,
  width = 400,
  height = 550,
}) => {

  return (
    <Card
      hoverable
      style={{ width: `${width}px`, height: `${height}px` }}
      cover={
        <div style={{ overflow: 'hidden', height: `${0.5 * height}px` }}>
          <img alt='example' src={coverImg} style={{ height: '100%' }} />
        </div>
      }
    >
      <Space direction='vertical' size='middle' style={{ display: 'flex' }}>
        <Meta title={name} description={runningHours} />
        <Tag color='red'>{location}</Tag>
        <Text style={{ fontSize: '28px' }}>{costEstimate}</Text>
        <Rate value={avgRating} style={{ marginLeft: '10px' }} disabled/>
      </Space>
    </Card>
  );
};

export default RestaurantCard;
