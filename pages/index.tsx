import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Nav from '../components/Nav';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>EXM Data Indexing</title>
        <meta name='description' content='EXM Data Indexing Application' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <Nav />
      </main>
    </div>
  );
};

export default Home;
