import { EnvironmentOutlined } from '@ant-design/icons';
import Results from '@/Components/Results';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { axiosInstance } from '@/api-config';
import { Spin } from 'antd';

export default function Restaurants() {
  const [isLoading, setIsLoading] = useState(true);
  const [campus, setCampus] = useState({ name: ''});
  const [restaurantsList, setRestaurantsList] = useState([]);
  const router = useRouter();

  const { campusId } = router.query;

  useEffect(() => {
    setIsLoading(true);
    const fetchCampus = async () => {
      const response = await axiosInstance.get(`/api/campus/${campusId}`);
      return response;
    };
    if (campusId) {
      fetchCampus()
        .then((response) => {
          const { id, name, Restaurant } = response.data;
          setCampus({
            id,
            name
          });
          setRestaurantsList(Restaurant);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
        })
    }
  }, [campusId]);

  return (
    <>
      <h1 style={{ fontSize: '1.8rem'}}>
        Hello, Welcome back ! 👋🏼
      </h1>
      <h2 style={{ fontSize: '1.25rem' }}>
        <EnvironmentOutlined />
        {" " + campus.name}
      </h2>
      {isLoading ? <Spin tip="Loading..." style={{ marginLeft: 'auto', width: '100%', marginTop: '20px'}}></Spin>:
        <Results data={restaurantsList} campus={campus} />
      }
    </>
  );
}
