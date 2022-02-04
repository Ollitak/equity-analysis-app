import React, { useState } from "react";
import { Button } from "semantic-ui-react";
import FeedItem from "../FeedItem";
import FilterBar from "./FilterBar";
import { useSelector } from "react-redux";
import prepareAnalyses from "../../utilities/prepareAnalyses";

/* If showFilterBar is set to true, renders FilterBar. Else, renders
button used to set showFilterBar true. */
const Filter = () => {
  const [showFilterBar, setShowFilterBar] = useState(false);

  if (showFilterBar) return <FilterBar setShowFilterBar={setShowFilterBar} />;

  return (
    <div style={{ maxWidth: 600, margin: "auto", marginBottom: "1em" }}>
      <Button
        onClick={() => setShowFilterBar(true)}
        content={"Apply filters"}
        style={{
          backgroundColor: "rgb(38, 38, 38)",
          color: "white",
          border: "2px inset white",
          height: "3em",
          width: "100%",
          borderRadius: 0
        }}
      />
    </div>
  );
};

/* Component to render analysis feed. It retreives analyses and filters from the
redux store and applies the filters to the analyses. Then, it renders filter component
and analysis feed. */
const Feed = () => {
  var analyses = useSelector((state) => state.analyses);
  const filters = useSelector((state) => state.filter);

  /* Apply filters to analyses. */
  analyses = prepareAnalyses(analyses, filters);

  return (
    <div>
      <Filter />

      {analyses.map((analysis) => (
        <FeedItem key={analysis.id} analysis={analysis} />
      ))}
    </div>
  );
};

export default Feed;
