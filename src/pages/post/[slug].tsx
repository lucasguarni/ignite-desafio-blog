import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { FaCalendar, FaUser, FaClock } from 'react-icons/fa';

import Header from '../../components/Header';

import { formatDate } from '../../services/formatDate';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter()

  function ReadTime() {
    const { data } = post;
    const wpm = 200; // media 200 palavras por minuto.

    const readingTime = data.content.reduce((time, content) => {
      let words = Number(content.heading.trim().split(/\s+/).length);
      words += Number(RichText.asText(content.body).trim().split(/\s+/).length);
      time += Math.ceil(words / wpm);

      return time;
    }, 0);

    return <span><FaClock />{readingTime} min</span>;
  }

  function Loading() {
    return (
      <span>Carregando...</span>
    );
  }

  function Content() {
    if (router.isFallback) {
      return <Loading />
    }
   
    return <>
      <div className={styles.bannerContainer}>
        <img src={post.data.banner.url} alt={post.data.title} />
      </div>
      <div className={commonStyles.container}>
        <h1 className={styles.postTitle}>{post.data.title}</h1>
        <div className={styles.postInfos}>
          <time dateTime={post.first_publication_date}><FaCalendar />{formatDate(post.first_publication_date)}</time>
          <span><FaUser />{post.data.author}</span>
          <ReadTime />
        </div>
      </div>
      { post.data.content.map((content, i) => {
        return <section key={i} className={commonStyles.container}>
          <h2 className={styles.contentHeading}>{content.heading}</h2>
          <div className={styles.postContent} dangerouslySetInnerHTML={{ __html: RichText.asHtml(content.body) }} />
        </section>
      }) }
    </>
  }

  return (
    <>
      <Header />
      <main role="main">
        <Content />
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const {results} = await prismic.getByType('posts');
  
  const paths = results.map((post => ({ params: { slug: post.uid } })));

  return {
    paths,
    fallback: true
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const {slug} = params;
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', String(slug));

  return {
    props: {
      post: response
    }
  }
};
