import Link from 'next/link';
import { Button, Menu } from 'antd';
import { CoffeeOutlined, HeartFilled } from '@ant-design/icons';
import { useAuthContext } from '@/contexts/AuthContext.jsx';

const Navbar = () => {
  const {
    authState: { user },
    authActions: {
      signout
    }
  } = useAuthContext();
  return (
    <>
      <Menu
        mode='horizontal'
        style={{ display: 'block', backgroundColor: '#f4ede7' }}
        selectable={false}
      >
        <Menu.Item
          key='logo'
          className='logo'
          style={{ fontSize: '24px', padding: '0px' }}
          icon={<CoffeeOutlined style={{ fontSize: '24px' }} />}
        >
          <Link href='/'>Food Finder</Link>
        </Menu.Item>
        {user && user.email && (
          <Menu.Item key='favourites' icon={<HeartFilled />}>
            <Link href='/favourites'>Favourites</Link>
          </Menu.Item>
        )}
        {!(user && user.email) && (
          <div style={{ float: 'right' }}>
            <Menu.Item key='login'>
              <Link href='/auth/login'>
                <Button style={{ background: '#1a1a1a', color: '#fff' }}>
                  Login
                </Button>
              </Link>
            </Menu.Item>
            <Menu.Item key='signup'>
              <Link href='/auth/signup'>
                <Button
                  style={{ background: '#f4ede7', border: '1px solid #1a1a1a' }}
                >
                  Sign Up
                </Button>
              </Link>
            </Menu.Item>
          </div>
        )}
        {user && user.email && (
          <div style={{ float: 'right' }}>
            <Menu.Item key='logout'>
              <Button
                style={{ background: '#f4ede7', border: '1px solid #1a1a1a' }}
                onClick={signout}
              >
                Logout
              </Button>
            </Menu.Item>
          </div>
        )}
      </Menu>
    </>
  );
};

export default Navbar;
