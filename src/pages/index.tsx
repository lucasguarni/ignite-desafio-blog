import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticProps } from 'next';
import Header from '../components/Header';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  formattedDate: string;
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
  return <>
    <Header />
    <main role="main">
      <section className={commonStyles.container}>
        {
          postsPagination.results.map(post => {
            return (
              <article key={post.uid} className={styles.postItem}>
                <header>
                  <h2><a href="#">{post.data.title}</a></h2>
                  <p><a href="#">{post.data.subtitle}</a></p>
                </header>

                <a href="#" className={styles.postInfos}>
                  <time dateTime={post.first_publication_date}>{post.formattedDate}</time>
                  <span>{post.data.author}</span>
                </a>
              </article>
            )
          })
        }
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
      formattedDate: format(new Date(post.first_publication_date), 'dd MMM yyyy' ,{ locale: ptBR }),
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
