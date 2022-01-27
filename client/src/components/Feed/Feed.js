import React, { useState } from "react";
import { Button } from "semantic-ui-react";
import FeedItem from "../FeedItem";
import FilterBar from "./FilterBar";
import { useSelector } from "react-redux";
import prepareAnalyses, { orderByDateASC, orderByDateDESC, orderByRatingASC, orderByRatingDESC } from "../../utilities/prepareAnalyses";

/* If showFilterBar is set to true, renders FilterBar. Else, renders
button used to set showFilterBar true. */
const Filter = () => {
  const [showFilterBar, setShowFilterBar] = useState(false);

  if(showFilterBar) return <FilterBar setShowFilterBar={setShowFilterBar} />;

  return (
    <div style={{ maxWidth:600, margin:"auto", marginBottom:"1em" }}>
      <Button
        onClick={() => setShowFilterBar(true)}
        content = {"Apply filters"}
        style={{
          backgroundColor:"black",
          color: "white",
          border: "1px solid white",
          height: "3em",
        }}
      />
    </div>
  );
};

/* Component to render analysis feed. It retreives analyses and filters from the
redux store and applies the filters to the analyses. Then, it renders filter component
and analysis feed. */
const Feed = () => {
  var analyses = useSelector(state => state.analyses);
  /* prepareAnalyses adds fields for every analysis element indicating how many hours ago
  the analysis was posted and what is its average rating */
  analyses = prepareAnalyses(analyses);

  const filter = useSelector(state => state.filter);

  if(filter.companyFilter) {
    analyses = analyses.filter(analysis =>
      analysis.stockInformation.name === filter.companyFilter
    );
  }

  if(filter.keywordFilter) {
    analyses = analyses.filter(analysis =>
      analysis.keyWords.includes(filter.keywordFilter)
    );
  }

  switch(filter.orderingFilter) {
  case("Most recent"):
    analyses = orderByDateASC(analyses); break;
  case("Oldest"):
    analyses = orderByDateDESC(analyses); break;
  case("Lowest rated"):
    analyses = orderByRatingASC(analyses); break;
  case("Highest rated"):
    analyses = orderByRatingDESC(analyses);
  }

  return(
    <div>
      <Filter />

      {analyses.map(analysis =>
        <FeedItem
          key={analysis.id}
          analysis={analysis}
        />
      )}
    </div>
  );
};

export default Feed;