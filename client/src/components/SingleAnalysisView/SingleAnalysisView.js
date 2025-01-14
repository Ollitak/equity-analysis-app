import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import CommentSectionModal from "./CommentSectionModal";
import FullAnalysisModal from "./FullAnalysisModal";
import ChartsModal from "./ChartsModal";
import { Divider, Label } from "semantic-ui-react";
import StockPriceChart from "./StockPriceChart";
import stockDataService from "../../services/stockData";
import { useDispatch } from "react-redux";
import { setError } from "../../reducers/notificationReducer";

import "./styles/singleAnalysisView.css";

/** Component renders colored recommendation label based on the given prop. */

const RecommendationLabel = ({ recommendation }) => {
  switch (recommendation) {
    case "BUY":
      return (
        <Label color="green" size="huge">
          BUY
        </Label>
      );
    case "HOLD":
      return (
        <Label color="yellow" size="huge">
          HOLD
        </Label>
      );
    case "SELL":
      return (
        <Label color="red" size="huge">
          SELL
        </Label>
      );
    default:
      return (
        <Label color="black" size="huge">
          N/A
        </Label>
      );
  }
};

/** Component renders detailed information of a single analysis. */

const SingleAnalysisView = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const [stockData, setStockData] = useState(null);

  // Retreive analysis that corresponds to the id in url path
  const analysis = useSelector((state) => state.analyses.find((a) => a.id === id));

  // Retreive stock price data from Yahoo Finance API for price chart when analysis-constant is set
  useEffect(() => {
    if (analysis) {
      stockDataService
        .getStockData(analysis.stockInformation.ticker)
        .then((stockData) => {
          setStockData(stockData);
        })
        .catch((e) => {
          dispatch(setError("Sorry, could not load historical stock data."));
        });
    }
  }, [analysis, dispatch]);

  // Return null if analysis is not (yet) defined ie. if the page is refreshed
  if (!analysis) return null;

  return (
    <div className="sav">
      <div className="sav-left">
        <div className="sav-left-wrapper">
          <h1 className="sav-title">OPTIONS</h1>
          <ChartsModal analysis={analysis} />
          <FullAnalysisModal analysis={analysis} />
          <CommentSectionModal analysis={analysis} id={id} />
          <button className="sav-left-button" onClick={() => history.push("/feed")}>
            BACK TO FEED
          </button>
        </div>
      </div>

      <div className="sav-center">
        <div className="sav-center-wrapper">
          <h1 className="sav-title">{analysis.title}</h1>
          <Divider horizontal className="sav-center-divider">
            report published by {analysis.user.username}
          </Divider>
          <div className="sav-summary-container">
            <p className="sav-summary">{analysis.content.summary}</p>
          </div>
        </div>
      </div>
      <div className="sav-right">
        <div className="sav-right-wrapper">
          <h1 className="sav-title">SUMMARY</h1>
          <div className="sav-right-item-container">
            <h1 className="sav-right-item-title">COMPANY</h1>
            <h1 className="sav-right-company-name">{analysis.stockInformation.name}</h1>
          </div>
          <div className="sav-right-item-container">
            <h1 className="sav-right-item-title">RECOMMENDATION</h1>
            <RecommendationLabel recommendation={analysis.recommendation} />
          </div>
          <div className="sav-right-item-container">
            <h1 className="sav-right-item-title">TARGET PRICE</h1>
            <Label tag color="grey" size="big">
              € {analysis.targetPrice}
            </Label>
          </div>
          <div className="sav-right-item-container">
            <h1 className="sav-right-item-title">HISTORICAL STOCK PRICE</h1>
            <StockPriceChart stockData={stockData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleAnalysisView;
