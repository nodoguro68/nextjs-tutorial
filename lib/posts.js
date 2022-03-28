import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import {remark} from 'remark'
import html from 'remark-html'

// postsのディレクトリを取得
const postsDirectory = path.join(process.cwd(), 'posts')

// ソートしたデータを返す関数
export function getSortedPostsData() {
    // postsのディレクトリを読み込む
    const fileNames = fs.readdirSync(postsDirectory)

    // posts内のファイルをループで回す
    const allPostsData = fileNames.map(fileName => {

        // idを作る
        // ファイル名がそのままid
        const id = fileName.replace(/\.md$/, '')

        // パスを作る
        const fullPath = path.join(postsDirectory, fileName)

        // ファイルの中身
        const fileContents = fs.readFileSync(fullPath, 'utf8')

        const matterResult = matter(fileContents)

        // ファイルの中身などをidと紐づける
        return {
            id,
            ...matterResult.data
        }
    })

    // ソートする
    return allPostsData.sort((a,b) => {
        if(a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}

// 全ての投稿のidを取得する
export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory)

    return fileNames.map(fileNames => {
        // idを返す
        return {
            params: {
                id: fileNames.replace(/\.md$/, '')
                // id: ['rezero', 'rem']
            }
        }
    })
}

// idからURLを取得する
export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // メタデータを解析する
    const matterResult = matter(fileContents)

    const processdContent = await remark()
        .use(html)
        .process(matterResult.content)
    const contentHtml = processdContent.toString();

    return {
        id,
        contentHtml,
        ...matterResult.data
    }
}

