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
  disabled=true,
  width = 400,
  height = 400,
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
        <Rate
          value={avgRating}
          style={{ marginLeft: '10px' }}
          disabled
          tooltips={['terrible', 'bad', 'normal', 'good', 'love it']}
        />
      </Space>
    </Card>
  );
};

export default RestaurantCard;
