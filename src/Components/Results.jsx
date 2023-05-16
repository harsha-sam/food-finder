import { List } from 'antd';
import Link from 'next/link';
import RestaurantCard from './RestaurantCard';

const Results = ({ data, campus }) => {

  return (
    <div style={{ marginTop: '50px' }}>
      <div>
        <List
          grid={{

            xs: 1,
            sm: 1,
            md: 2,
            lg: 2,
            xl: 3,
          }}
          dataSource={data}
          renderItem={(item) => (
            <Link href={`/campus/${campus.id}/restaurants/${item.id}`} key={item.id}>
              <List.Item>
                <RestaurantCard {...item} />
              </List.Item>
            </Link>
          )}
        />
      </div>
    </div>
  );
}

export default Results
