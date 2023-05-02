import { EnvironmentOutlined } from '@ant-design/icons';
import Results from '@/Components/Results';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Restaurants() {
  const [campusName, setCampusName] = useState('');
  const [restaurantsList, setRestaurantsList] = useState([]);
  const router = useRouter();

  const { campusId } = router.query;

  useEffect(() => {
    const fetchCampus = async () => {
      const response = await axios.get(`/api/campus/${campusId}`);
      return response;
    };
    fetchCampus()
      .then((response) => {
        const { name, Restaurant } = response.data;
        setCampusName(name);
        setRestaurantsList(Restaurant);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [campusId]);

  return (
    <>
      <h1 style={{ fontSize: '28px' }}>
        <EnvironmentOutlined />
        {" " + campusName}
        <Results data={restaurantsList} />
      </h1>
    </>
  );
}
