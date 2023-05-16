import FoodItemsList from '@/Components/FoodItemsList';
import RestaurantCard from '@/Components/RestaurantCard';
import { Input, Tabs, List, Button, message, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { axiosInstance } from '@/api-config';
import { useAuthContext } from '@/contexts/AuthContext';
import moment from 'moment';
import { Rate } from 'antd';

const { Search, TextArea } = Input;

export default function Restaurant() {
  const {
    authState: { user },
  } = useAuthContext();
  const router = useRouter();
  const { campusId, restaurantId } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [review, setReview] = useState('');
  const [restaurant, setRestaurant] = useState({});
  const [cuisines, setCuisines] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [myRating, setMyRating] = useState(0);
  const [favorites, setFavourites] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const handlePostReview = () => {
    if (review.length > 0) {
      axiosInstance
        .post('/api/review', {
          custId: user.id,
          restaurantId,
          custName: user.full_name,
          description: review,
        })
        .then((response) => {
          const newReviews = [...reviews, response.data];
          setReviews(newReviews);
          message.success('Success !');
          setReview('');
        })
        .catch((err) => {
          message.error(
            err?.response?.data?.error ||
              'something went wrong, please try again'
          );
        });
    }
  };
  const handleSearch = (value) => {
    const newCuisines = [];
    if (value) {
      cuisines.forEach((cuisine) => {
        const filteredDishes = cuisine.items.filter((item) =>
          item.label?.en?.includes(value)
        );
        if (filteredDishes.length > 0) {
          newCuisines.push({
            ...cuisine,
            items: filteredDishes,
          });
        }
      });
      setFilteredData(newCuisines);
    } else {
      setFilteredData(cuisines);
    }
  };

  useEffect(() => {
    if (restaurantId) {
      setIsLoading(true);
      const fetchInfo = async () => {
        const response = await axiosInstance.get(
          `/api/campus/${campusId}/restaurants/${restaurantId}`
        );
        return response;
      };
      fetchInfo()
        .then((response) => {
          const {
            name,
            imageUrl,
            runningHours,
            location,
            costEstimate,
            avgRating,
            groups,
            reviews,
            myRating,
            favourites
          } = response.data;
          setRestaurant({
            name,
            imageUrl,
            runningHours,
            location,
            costEstimate,
            avgRating,
          });
          setReviews(reviews);
          setCuisines(groups);
          setMyRating(myRating);
          setFilteredData(groups);
          setFavourites(favourites); //
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
        })
    }
  }, [campusId, restaurantId]);

  const handleRateChange = (val) => {
    messageApi.open({
      type: 'loading',
      content: 'Action in progress..',
      duration: 0,
    });
    axiosInstance.post('/api/ratings', {
      custId: user.id,
      restaurantId,
      rating: val
    }).then((response) => {
      setMyRating(val);
      setRestaurant({
        ...restaurant,
        avgRating: response.data.avgRating
      })
      message.success('Success !');
    })
      .catch(() => {
      message.error('Something went wrong! Please try again');
      })
      .finally(() => {
        messageApi.destroy();
    })
  }

  if (isLoading) {
    return (
      <Spin
        tip='Loading...'
        style={{ marginLeft: 'auto', width: '100%', marginTop: '20px' }}
      ></Spin>
    );
  }
  return (
    <div style={{ display: 'flex', gap: '80px' }}>
      {contextHolder}
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
          items={filteredData.map((group) => {
            return {
              label: group.name,
              key: group.id,
              children: <FoodItemsList items={group.items} restaurantId={restaurantId} favourites={favorites} />,
            };
          })}
        />
      </div>
      <div style={{ width: '30%' }}>
        {!(user && user.id) && (
          <p>Please login to view or post rating and reviews</p>
        )}
        <h1>Your Rating</h1>
        <div>
          <Rate value={myRating} disabled={!(user && user.id)} onChange={handleRateChange} tooltips={['terrible', 'bad', 'normal', 'good', 'love it']} />
        </div>
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
