import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import styles from "./more-info.scss";
import useObservationData from "../hooks/useObservationData";

export interface FamilyHistoryProps {
  patientUuid: string;
  code: string;
}

const FamilyHistory: React.FC<FamilyHistoryProps> = ({ code }) => {
  const [patientUuid, setPatientUuid] = useState("");

  const [loading, setLoading] = useState(false);

  const [patientData, setPatientData] = useState([]);

  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const { data, defaultFamilyTableHeaders } = useObservationData(patientUuid)

  const getPatientUuid = () => {
    const currentUrl = window.location.href;

    // Regular expression to match UUID pattern
    const uuidRegex = /\/patient\/([a-f\d]{8}(-[a-f\d]{4}){4}[a-f\d]{8})\//;
    const match = uuidRegex.exec(currentUrl);

    const uuid = match ? match[1] : null;

    setPatientUuid(uuid);
  };

  useEffect(() => {
    getPatientUuid();
  }, []);
  //   try {
  //     setLoading(true);

  //     const {
  //       data: { results },
  //     } = await axios.get(
  //       `/openmrs/ws/rest/v1/obs?patient=${patientUuid}&_sort=-date&limit=100`
  //     );
  //     const generalInfoArray = [];

  //     for (let i = 0; i < results.length - 1; i++) {
  //       if (results[i].display.includes("General Family Information")) {
  //         generalInfoArray.push({
  //           display: results[i].display.split(":")[1],
  //           index: i,
  //         });
  //       }
  //     }

  //     for (let i = 0; i < generalInfoArray.length - 1; i++) {
  //       const subArray = results.slice(generalInfoArray[i].index + 1);
  //       const valuesArray = generalInfoArray[i].display.split(",");
  //       const valueObject = {};

  //       for (let j = 0; j < valuesArray.length - 1; j++) {
  //         const matchingItem = subArray.find((item) =>
  //           item.display.includes(valuesArray[j])
  //         );

  //         valueObject[matchingItem.display.split(":")[0]] =
  //           matchingItem.display.split(":")[1];

  //         setColumns((prevState) =>
  //           prevState.some(
  //             (item) => item.name === matchingItem.display.split(":")[0]
  //           )
  //             ? prevState
  //             : [
  //                 ...prevState,
  //                 {
  //                   name: matchingItem.display.split(":")[0],
  //                   selector: (row) => row[matchingItem.display.split(":")[0]],
  //                 },
  //               ]
  //         );
  //       }
  //       setRows((prev) => [...prev, valueObject]);
  //     }

  //     const formattedData = results.filter((item) =>
  //       item.display.includes("General Family Information")
  //     );

  //     setPatientData(formattedData);
  //   } catch (e) {
  //     console.error("error", e);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getObservationData = () => {
    if (data && data.results && data.results.length > 0) {
      setLoading(true)

      const allFamilyMembers = data.results.flatMap(
        (result) => result.familyMembers || []
      )

      if(allFamilyMembers.length > 0) {
        setColumns(defaultFamilyTableHeaders)

        setRows(allFamilyMembers)
      }else {
        console.log("No family members present")
      }

      setLoading(false)
    } else {
      console.log("Data is empty or not yet available")
    }
  }

  useEffect(() => {
    if (data) getObservationData();
  }, [data]);

  const customStyles = {
    cells: {
      style: {
        minHeight: "72px",
        fontSize: "14px",
        fontWeight: "500",
      },
    },
    headCells: {
      style: {
        fontSize: ".9rem",
        fontWeight: "600",
      },
    },
  };

  return (
    <div className={styles.datatable}>
        <DataTable
          columns={columns}
          data={rows}
          responsive
          pagination
          customStyles={customStyles}
          striped
          fixedHeader
          pointerOnHover
          noDataComponent={
            <div className={styles.emptyText}>No Family Members Found</div>
          }
        />
    </div>
  );
};
export default FamilyHistory;
