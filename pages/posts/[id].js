import Head from "next/head"
import Layout from "../../components/layout"
import { getAllPostIds, getPostData } from "../../lib/posts"
import Date from "../../components/date"
import utilStiles from '../../styles/utils.module.css'

export default function Post({postData}) { // postData = getStaticProps
    return (
        <Layout>
            <Head>
                <title>{postData.title}</title>
            </Head>
            <article>
                <h1 className={utilStiles.headingXl}>
                    {postData.title}
                </h1>
                <div className={utilStiles.lightText}>
                    <Date dateString={postData.date} />
                </div>
                <div dangerouslySetInnerHTML={{__html: postData.contentHtml}}></div>
            </article>
        </Layout>
    )
}

// サーバーで動く
// どんなページを表示する可能性があるのかを判断する
// 事前にビルドしたときに静的なファイルを用意する
export async function getStaticPaths() {
    // idをパスで使う
    const paths =  getAllPostIds()
    return {
        paths,
        fallback: false
    }
}

// サーバーで動く
// ビルド時に実行される
// データを取ってくる
export async function getStaticProps({params}) {
    const postData = await getPostData(params.id)
    return {
        props: {
            postData
        }
    }
}

