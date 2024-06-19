import React, { useContext } from "react";
import { SimpleBarChart } from "@carbon/charts-react";
import "@carbon/charts-react/styles.css";
import styles from "./styles/index.scss";
import { DashboardContext } from "../context/DashboardContext";
import { Loading } from "@carbon/react";
import { ScaleTypes } from "../types";

const NewlyEnrolled = () => {
  const {
    chartData: { newlyEnrolledClients },
    currentTimeFilter,
  } = useContext(DashboardContext);

  const options = {
    title: "Clients currently receiving ART",
    axes: {
      bottom: {
        title: "",
        mapsTo: currentTimeFilter,
        scaleType: "labels" as ScaleTypes,
      },
      left: {
        title: " Number of clients",
        mapsTo: "clients",
        scaleType: "linear" as ScaleTypes,
      },
    },
    curve: "curveMonotoneX",
    height: "400px",
  };
  return (
    <div className={styles.chartContainer}>
      {newlyEnrolledClients?.loading ? (
        <Loading className={styles.spinner} withOverlay={false} />
      ) : (
        <SimpleBarChart
          data={newlyEnrolledClients?.processedChartData}
          options={options}
        />
      )}
    </div>
  );
};

export default NewlyEnrolled;
