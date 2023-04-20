import { Typography, Select } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';
import bgImg from '@/assets/background.jpg';
import orderImg from '@/assets/order-food.svg';
import axios from 'axios';
import { useEffect, useState } from 'react';

const { Title, Text } = Typography;

export default function Homepage() {
  const [campusList, setCampusList] = useState([]);
  
  useEffect(() => {
    const fetchCampus = async () => {
      const response = await axios.get('/api/campus');
      return response;
    };
    fetchCampus().then((response) => {
      setCampusList(response.data);
    }).catch((error) => console.log)
  }, []);

  const router = useRouter();

  const data = campusList.map((campus) => {
    return {
      label: campus.name,
      value: campus.id,
    };
  });
  return (
    <>
      <div style={{ position: 'relative', margin: '0 -50px' }}>
        <Image
          src={bgImg}
          alt='background'
          height={800}
          style={{ width: '100%' }}
        />
        <div
          style={{
            position: 'absolute',
            top: '28%',
            left: '30%',
          }}
        >
          <Title
            strong
            level={1}
            style={{
              fontSize: '60px',
            }}
          >
            Campus eats, your way.
          </Title>
          <Text
            style={{
              fontSize: '24px',
            }}
          >
            Find Best Delicious Food Options !
          </Text>
          <br />
          <Select
            showSearch
            showArrow={false}
            optionFilterProp='label'
            placeholder='Enter your Location'
            style={{ width: 600, marginTop: '30px' }}
            size='large'
            options={data}
            onSelect={(value) => {
              router.push(`/campus/${value}`,undefined, { shallow: true });
            }}
          />
        </div>
      </div>
      <div
        style={{
          marginTop: '50px',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '30px',
        }}
      >
        <div>
          <Title
            strong
            level={2}
            style={{
              fontSize: '40px',
              paddingTop: '50px',
            }}
          >
            Favourite, Rate and Review
          </Title>
          <Text
            style={{
              fontSize: '24px',
            }}
          >
            Browse and favourite meals, snacks, and drinks from your campus, on
            your browser or with our mobile app.
          </Text>
        </div>
        <Image src={orderImg} alt='order food' />
      </div>
      {/* <div>
          <Title
            strong
            level={2}
            style={{
              fontSize: '30px',
            }}
          >
            Download our app for an exclusive experience
          </Title>
          <Text
            style={{
              fontSize: '20px',
            }}
          ></Text>
        </div> */}
    </>
  );
};
