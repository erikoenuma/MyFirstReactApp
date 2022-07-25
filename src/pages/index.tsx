import { useState } from "react";
// function componentsにはNext Pageの使用推奨（公式）
// https://nextjs.org/docs/api-reference/data-fetching/get-initial-props#typescript
import type { NextPage, GetServerSideProps } from "next";

/*
Typescriptのinterfaceとは
- メンバーや型の定義を行う
- inplementsキーワードを使用すると継承のような形でインターフェースを実装できる
- nullを許容しない（定義されたメンバーが必ず存在することが保証される）
*/
// APIのレスポンスに含まれるデータ構造を型付け
interface SearchCatImage {
  id: string;
  url: string;
  width: number;
  height: number;
}

/*
typeとは
- 型や型の組み合わせに別名をつける

interfaceとの主な違い
https://qiita.com/tkrkt/items/d01b96363e58a7df830e
- 同名のinterfaceは全てマージされるので、これを利用してinterfaceを拡張できる
- 同名のtypeはエラーになり宣言できない
- typeは複数の型全てを満たす型（交差型）、複数の型いずれかを満たす型（共用体型）、タプル型を作ることができる
*/
type SearchCatImageResponse = SearchCatImage[];

const fetchCatImage = async (): Promise<SearchCatImage>  => {
  // fetch()でAPI通信を行う
  // Responseオブジェクトを戻り値で取得
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  // json()メソッドでResponseのBodyテキストをjsonに変換
  const result = (await res.json()) as SearchCatImageResponse;
  return result[0];
};

interface IndexPageProps {
  initialCatImageUrl: string;
};

// function ComponentsでNextPageを使用
// getServerSidePropsで取得しinterfaceで定義したデータをpropsで受け取る
// : NextPage<IndexPageProps>の部分で引数の型指定をしている
const IndexPage: NextPage<IndexPageProps> = ({initialCatImageUrl}) => {
  const [catImageUrl, setCatImageUrl] = useState (initialCatImageUrl);

  const handleClick = async () => {
    const image = await fetchCatImage();
    setCatImageUrl(image.url);
  };
  return (
    <div>
      <button onClick={handleClick}>きょうのにゃんこ🐱</button>
      <div style={{ marginTop: 8 }}>
        <img src={catImageUrl} />
      </div>
    </div>
  );
};

/*
getServerSidePropsとは
- ページ表示前に通信を行なってpropsを返してくれる
- サーバー側でのみ実行される
- 公式ドキュメント
https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props
*/
export const getServerSideProps: GetServerSideProps<IndexPageProps> = async () => {
  const catImage = await fetchCatImage();
  return {
    props: {
      initialCatImageUrl: catImage.url,
    },
  };
};

export default IndexPage;