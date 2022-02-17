import React, {useEffect, useState} from "react";
import tmdb from "./tmdb";
import MovieRow from './componets/MovieRow';
import "./App.css";
import FeaturedMovie from "./componets/FeaturedMovie";
import Header from "./componets/header";

export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFreaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect( () => {
    const loadAll = async () => {
      // pegando a lista TOTAL
      let list = await tmdb.getHomeList();
      setMovieList(list);

      // Pegando o Featured
      let originals = list.filter(i=>i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomChosen];  
      let chosenInfo = await tmdb.getMovieInfo(chosen.id, 'tv');

      setFreaturedData(chosenInfo);
    }

    loadAll();
  }, []);

  useEffect( () => {
    const scrollListener = () => {
      if(window.scrollY > 10){
        setBlackHeader(true);
      }else{
        setBlackHeader(false);
      }
    }

    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  }, []);

  return(
    <div className="page">

      <Header black={blackHeader} />

      { featuredData &&
        <FeaturedMovie item={featuredData} />
      }

      <section className="lists">
        {movieList.map((item, key)=>( // laço de repetição para nas listas de filmes
            <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer>
          Feito com <span role="img" aria-label="coração">🖤</span> pela B7web<br/>
          Diretos de imagem para a Netflix<br/>
          Dados pegos do site themovie.org
      </footer>

      {movieList.length <= 0 &&
        <div className="loading">
          <img src="https://c.tenor.com/Rfyx9OkRI38AAAAC/netflix-netflix-startup.gif" />
        </div>         
      }

    </div>

    
  );
}