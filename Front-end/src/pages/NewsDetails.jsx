import { useParams } from "react-router-dom";
import Header from "../components/general/Header.jsx";
import Sidebar from "../components/general/Sidebar.jsx";

import NewsHeader from "../components/news/newsdetails/NewsHeader.jsx";
import NewsCover from "../components/news/newsdetails/NewsCover.jsx";
import NewsContent from "../components/news/newsdetails/NewsContent.jsx";
import NewsActions from "../components/news/newsdetails/NewsActions.jsx";

import useNewsDetails from "../components/news/newsdetails/useNewsDetails.js"; 
import "./News.css";

import { useUser } from "../context/UserContext.jsx";
import NewsComments from "../components/news/newsdetails/NewsComments.jsx";

export default function NewsDetails() {

    const { user, loadingUser } = useUser();

    const { id } = useParams();
    const {
        news,
        loading,
        deleting,
        formattedDate,
        handleDelete,
        navigateBack,
        handleEdit
    } = useNewsDetails(id);

    if (loading) return <p className="news-details-loading">Carregando notícia...</p>;
    if (!news) return <p className="news-details-loading">Notícia não encontrada.</p>;

    return (
        <>
            <Header />

            <div className="news-page">
                <Sidebar />

                <div className="news-content">
                    <div className="news-details">

                        <NewsHeader
                            title={news.title}
                            addInfo={news.add_info}
                            creator={news.creator_name}
                            date={formattedDate}
                        />

                        <NewsCover src={news.cover_image} title={news.title} />

                        <NewsContent content={news.content} />

                        <NewsActions
                            deleting={deleting}
                            onDelete={handleDelete}
                            onBack={navigateBack}
                            onEdit={handleEdit}
                        />

                        <NewsComments articleId={news.id} currentUser={user}/>
                    </div>                 
                </div>          
            </div>
        </>
    );
}