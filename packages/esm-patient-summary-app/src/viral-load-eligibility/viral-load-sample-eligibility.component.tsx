import React, { useState, useEffect } from "react";
import styles from "./vl-eligibility.scss";
import { useTranslation } from "react-i18next";
import {
  Tile,
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  DataTableSkeleton,
} from "@carbon/react";
import useObservationData from "../hooks/useObservationData";
import usePatientData from "../hooks/usePatientData";
import { useLayoutType } from "@openmrs/esm-framework";
import {
  CardHeader,
  ErrorState,
  EmptyState,
} from "@openmrs/esm-patient-common-lib";

export interface ProgramSummaryProps {
  patientUuid: string;
  code: string;
}

const ViralLoadEligibility: React.FC<ProgramSummaryProps> = ({
  patientUuid,
}) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === "tablet";
  const displayText = t("viralLoadHistory", "Viral Load History");
  const headerTitle = t("viralLoadHistory", "Viral Load History");
  const { flags } = usePatientData(patientUuid);
  const { error, isLoading, eligibilityDetails, data } = useObservationData(
    patientUuid,
    flags
  );

  const [tableHeaders, setTableHeaders] = useState([]);
  const [tableRows, setTableRows] = useState([]);

  useEffect(() => {
    if (eligibilityDetails) {
      const headers = [
        { key: "dateSampleCollected", header: t("Date Sample Collected") },
        { key: "dateVLRecieved", header: t("Date VL Results Recieved") },
        { key: "lastVlRecieved", header: t("Last VL Recieved") },
      ];
      setTableHeaders(headers);
    }
  }, [eligibilityDetails, t]);

  useEffect(() => {
    if (data?.results?.length) {
      const rows = data.results.map((item, index) => ({
        id: `row-${index}`,
        dateSampleCollected: item.dateVLSampleCollected ?? "---",
        dateVLRecieved: item.dateVLResultsReceived ?? "---",
        lastVlRecieved: item.vlResults ?? "---",
      }));
      setTableRows(rows);
    }
  }, [data]);

  if (isLoading) {
    return (
      <Tile>
        <DataTableSkeleton role="progressbar" compact={!isTablet} zebra />
      </Tile>
    );
  }

  if (error) {
    return <ErrorState error={error} headerTitle={headerTitle} />;
  }

  if (!eligibilityDetails) {
    return null;
  }

  return (
    <>
      {(() => {
        if (tableRows?.length) {
          return (
            <div>
              <CardHeader title={headerTitle} children={""} />
              <DataTable
                headers={tableHeaders}
                isSortable
                overflowMenuOnHover={!isTablet}
                rows={tableRows}
                size={isTablet ? "lg" : "sm"}
                useZebraStyles
              >
                {({ rows, headers, getTableProps, getHeaderProps }) => (
                  <TableContainer className={styles.tableContainer}>
                    <Table
                      aria-label="cl-samples"
                      className={styles.table}
                      {...getTableProps()}
                    >
                      <TableHead>
                        <TableRow>
                          {headers.map((header) => (
                            <TableHeader
                              {...getHeaderProps({ header })}
                              key={header.key}
                            >
                              {header.header}
                            </TableHeader>
                          ))}
                          <TableHeader aria-label={t("actions", "Actions")} />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row) => (
                          <TableRow key={row.id}>
                            {row.cells.map((cell) => {
                              return (
                                <TableCell key={cell.id}>
                                  {cell.value}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </DataTable>
            </div>
          );
        }
        return (
          <EmptyState displayText={displayText} headerTitle={headerTitle} />
        );
      })()}
    </>
  );
};
export default ViralLoadEligibility;
