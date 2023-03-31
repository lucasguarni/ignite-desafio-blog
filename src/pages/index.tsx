import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { FaCalendar, FaUser } from 'react-icons/fa';

import Header from '../components/Header';

import { formatDate } from '../services/formatDate';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  const [results, setResults] = useState(postsPagination.results);
  
  async function loadMore() {
    const data = await fetch(postsPagination.next_page)
      .then((response) => response.json());
    
    const currentResults = [...results];

    setNextPage(data.next_page);
    setResults([...currentResults, ...data.results]);
  }


  return <>
    <Header />
    <main role="main">
      <section className={commonStyles.container}>
        {
          results.map(post => {
            return (
              <article key={post.uid} className={styles.postItem}>
                  <header>
                    <h2><Link href={`/post/${post.uid}`}>{post.data.title}</Link></h2>
                    <p><Link href={`/post/${post.uid}`}>{post.data.subtitle}</Link></p>
                  </header>

                <Link href={`/post/${post.uid}`}>
                  <a className={styles.postInfos}>
                    <time dateTime={post.first_publication_date}><FaCalendar />{formatDate(post.first_publication_date)}</time>
                    <span><FaUser />{post.data.author}</span>
                  </a>
                </Link>
              </article>
            )
          })
        }

        {nextPage && (
          <button className={styles.buttonLoadMore} onClick={loadMore}>Carregar mais posts</button>
        )}
      </section>
    </main>
  </>
  ;
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const {results, next_page} = await prismic.getByType('posts', {
    pageSize: 1
  });

  const posts: Post[] = results.map(post => {
    return {
      first_publication_date: post.first_publication_date,
      uid: post.uid,
      data: {
        author: post.data.author,
        subtitle: post.data.subtitle,
        title: post.data.title
      }
    }
  });
  

  return {
    props: { 
      postsPagination: {
        results: posts,
        next_page
      } 
    }
  }
};
