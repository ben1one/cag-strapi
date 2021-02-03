import ReactMarkdown from "react-markdown";
import Moment from "react-moment";
import { fetchAPI } from "../../lib/api";
import Layout from "../../components/layout";
import Image from "../../components/image";
import Seo from "../../components/seo";
import { getStrapiMedia } from "../../lib/media";

import { Button, CagThemeProvider } from '@cag/cag-components';

import { ModulabTable } from '@cag/cag-components';

const Article = ({ article, categories }) => {
  const imageUrl = getStrapiMedia(article.image);

  const seo = {
    metaTitle: article.title,
    metaDescription: article.description,
    shareImage: article.image,
    article: true,
  };

  // const Button = () => <h1>Button</h1>;
  
  const myData = JSON.parse('{"dataTable":[{"dataRow":[{},{},{"image":{"url":"https://images.contentstack.io/v3/assets/bltc05b5aa7ae1c3a47/blt4d5280b5b3eb1fa9/5c52b6f8d626b8290a8e50aa/StandardCharteredUnlimitedMasterCard.png?width=200","title":""},"text":{"children":"Standard Chartered Unlimited Credit Card"},"button":{"children":"Apply now"}},{"image":{"url":"https://images.contentstack.io/v3/assets/bltc05b5aa7ae1c3a47/bltcdd47f9ce839f265/5e7dab80997d752c7ef32693/CitiPremierMilesMC.png?width=200","title":""},"text":{"children":"Citi PremierMiles Card"},"button":{"children":"Apply now"}}]},{"dataRow":[{"text":{"children":"Provider Name"}},{"text":{"children":"Standard Chartered"}},{"text":{"children":"Citibank"}}]},{"dataRow":[{"text":{"children":"Product Name"}},{"text":{"children":"Standard Chartered Unlimited Credit Card"}},{"text":{"children":"Citi PremierMiles Card"}}]}],"variant":"card comparison"}')

  const ContentParse = (props) => {
    console.log(props);
    switch(props.prop.type) {
      case 'paragraph': {
        return props.prop.children.map((child => {
          console.log(child);
          if(child.type==='product-comparison'){
            return <ModulabTable {...myData}></ModulabTable>
          }
          if (child.bold) {
            return <span style={{fontWeight: 'bold'}}>{child.text}</span>
          } else if (child.italic) {
            return <span style={{fontStyle: 'italic'}}>{child.text}</span>
          } else {
            return <span>{child.text}</span>
          }
        }));
      };
      case 'product-comparison': {
        return (
          <span>
            <ModulabTable {...myData}></ModulabTable>
          </span>
        );
      };      
      case 'cag-button': {
        return (
          <span>
            <Button>{props.newTitle}</Button>
          </span>
        );
      };
      default: return <Button size="small" onClick={()=>console.log('hi')} dataSelectorId="someButton">Custom</Button>;
    }
  }

  return (
    <Layout categories={categories}>
      <Seo seo={seo} />
      <CagThemeProvider ssr={{
          isTablet: false,
          isMobile: false
        }}>
        <div
          id="banner"
          className="uk-height-medium uk-flex uk-flex-center uk-flex-middle uk-background-cover uk-light uk-padding uk-margin"
          data-src={imageUrl}
          data-srcset={imageUrl}
          data-uk-img
        >
          <h1>{article.title}</h1>
        </div>
        <div className="uk-section">
          <div className="uk-container uk-container-small">
            <pre>
              <ReactMarkdown source={article.content} escapeHtml={false} />
            </pre>
            {JSON.parse(article.content).map((obj, i) => {     
              return <ContentParse key={i} prop={obj} />   
            })}
            <hr className="uk-divider-small" />
            <div className="uk-grid-small uk-flex-left" data-uk-grid="true">
              <div>
                {article.author.picture && (
                  <Image
                    image={article.author.picture}
                    style={{
                      position: "static",
                      borderRadius: "50%",
                      height: 30,
                    }}
                  />
                )}
              </div>
              <div className="uk-width-expand">
                <p className="uk-margin-remove-bottom">
                  By {article.author.name}
                </p>
                <p className="uk-text-meta uk-margin-remove-top">
                  <Moment format="MMM Do YYYY">{article.published_at}</Moment>
                </p>
              </div>
            </div>
          </div>
        </div>
      </CagThemeProvider>
    </Layout>
  );
};

export async function getStaticPaths() {
  const articles = await fetchAPI("/articles");

  return {
    paths: articles.map((article) => ({
      params: {
        slug: article.slug,
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const articles = await fetchAPI(
    `/articles?slug=${params.slug}&status=published`
  );
  const categories = await fetchAPI("/categories");

  return {
    props: { article: articles[0], categories },
    revalidate: 1,
  };
}

export default Article;
