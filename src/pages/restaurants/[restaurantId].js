import FoodItemsList from '@/Components/FoodItemsList';
import RestaurantCard from '@/Components/RestaurantCard';
import { Input, Tabs, List, Button, message} from 'antd';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAuthContext } from '@/contexts/AuthContext';
import moment from 'moment';

const { Search, TextArea } = Input;

export default function Restaurant() {
  const { authState: {
    user
  } } = useAuthContext();
  const router = useRouter();
  const { restaurantId } = router.query;
  const [review, setReview] = useState('');
  const [restaurant, setRestaurant] = useState({});
  const [cuisines, setCuisines] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const handlePostReview = () => {
    if (review.length > 0) {
      axios
        .post('/api/review', {
          custId: user.id,
          restaurantId,
          custName: user.full_name,
          description: review,
        })
        .then((response) => {
          const newReviews = [...reviews, response.data];
          setReviews(newReviews)
          message.success('Success !');
          setReview('')
        })
        .catch((err) => {
          message.error(err?.response?.data?.error || 'something went wrong, please try again');
        });
    }
  }
  console.log(reviews);
  const handleSearch = (value) => {
    const newCuisines = []
    if (value) {
      cuisines.forEach((cuisine) => {
        const filteredDishes = cuisine.Dish.filter((item) => item.name.includes(value))
        if (filteredDishes.length > 0) {
          newCuisines.push({
            ...cuisine,
            Dish: filteredDishes
          })
        }
      })
      setFilteredData(newCuisines);
    }
    else {
      setFilteredData(cuisines);
    }
  }

  useEffect(() => {
    const fetchInfo = async () => {
      const response = await axios.get(`/api/restaurants/${restaurantId}`);
      return response;
    };
    fetchInfo()
      .then((response) => {
        const { name, imageUrl, runningHours, location, costEstimate, avgRating, Cuisine, Reviews } = response.data;
        setRestaurant({
          name,
          imageUrl,
          runningHours,
          location,
          costEstimate,
          avgRating
        })
        setReviews(Reviews)
        setCuisines(Cuisine)
        setFilteredData(Cuisine)
      })
      .catch((error) => {
        console.log(error);
      });

  }, [restaurantId])
  return (
    <div style={{ display: 'flex', gap: '80px' }}>
      <div>
        <RestaurantCard width={360} height={500} {...restaurant} />
      </div>
      <div
        style={{
          display: 'flex',
          gap: '30px',
          flexDirection: 'column',
          width: '40%',
        }}
      >
        <Search
          placeholder='Search for an item'
          allowClear
          size='large'
          style={{
            position: 'fixed',
            top: '15px',
            width: '40%',
            marginBottom: '20px',
            zIndex: '300',
          }}
          onSearch={handleSearch}
        />
        <Tabs
          size='large'
          type='card'
          items={filteredData.map((item) => {
            return {
              label: item.name,
              key: item.id,
              children: <FoodItemsList items={item.Dish} />,
            };
          })}
        />
      </div>
      <div style={{ width: '30%' }}>
        <h1>Reviews ({reviews.length})</h1>
        <div>
          <TextArea
            placeholder='Write down your review'
            autoSize={{ minRows: 2, maxRows: 4 }}
            allowClear
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
          <Button
            style={{ background: '#1a1a1a', color: '#fff', marginTop: '10px' }}
            onClick={handlePostReview}
            disabled={!(user && user.id)}
          >
            Submit
          </Button>
        </div>
        <List
          itemLayout='horizontal'
          dataSource={[...reviews]}
          renderItem={(item, index) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                title={
                  <>
                    <p>
                      {moment(item.createdAt).format(
                        'MMM D, YYYY [at] h:mm A z'
                      )}
                    </p>
                    <p>{item.custName}</p>
                  </>
                }
                description={item.description}
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}
