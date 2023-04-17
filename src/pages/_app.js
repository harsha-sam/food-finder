import '@/styles/globals.css'
import { Layout } from "antd";
import Navbar from "@/Components/Navbar"
import { AuthProvider } from '@/contexts/AuthContext.jsx';

const { Header, Content, Footer } = Layout;
export default function App({ Component, pageProps }) {
  return <AuthProvider>
    <Layout style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
    }}>
      <Header style={{ backgroundColor: '#f4ede7', flexShrink: '0'}}>
          <Navbar />
      </Header>
      <Content style={{ backgroundColor: '#f4ede7', padding: '0 50px', flex: '1 0 auto' }}>
        <Component {...pageProps} />
      </Content>
      <Footer style={{ textAlign: 'center', backgroundColor: '#f4ede7', flexShrink: '0'}}>
          Food Finder ©2023 Created by UMBCDevs
      </Footer>
    </Layout>
  </AuthProvider>
}
