"use client";
import React, { useState, useEffect, useRef, createContext } from "react";
import { AgGridReact } from "ag-grid-react";
import styles from "@/app/page.module.css";
import { Button } from "@/components/ui/button";
import { _setAriaColSpan, themeMaterial } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import CrudButtons from "@/components/CrudButtons";
import axios from "axios";
import { AlertDestructive } from "@/components/ErrorAlert";

export const columnsContext = createContext(null);
ModuleRegistry.registerModules([AllCommunityModule]);
export default function Home() {
  const gridRef = useRef<AgGridReact>(null);
  const [rowData, setRowData] = useState<any>([]);
  const [error, setError] = useState<string>("");
  const [columnDefs] = useState<any>([
    {
      field: "ticker",
      colId: "ticker",
      headerName: "Ticker",
      sortable: true,
      filter: true,
      pinned: "left",
    },
    {
      field: "timestamp",
      headerName: "Timestamp",
      sortable: true,
      filter: true,
      pinned: "left",
    },
    {
      field: "ask_price",
      headerName: "Ask Price",
      sortable: true,
      filter: true,
    },
    {
      field: "bid_price",
      headerName: "Bid Price",
      sortable: true,
      filter: true,
    },
    {
      field: "close_price",
      headerName: "Close Price",
      sortable: true,
      filter: true,
    },
    {
      field: "volume",
      headerName: "Volume",
      sortable: true,
      filter: true,
    },
    {
      field: "vva",
      headerName: "VVA",
      sortable: true,
      filter: true,
    },
  ]);
  useEffect(() => {
    axios
      .get("/trades")
      .then((response) => {
        console.log("Trades fetched successfully:", response.data);
        setRowData(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the trades:", error);
      });
  }, []);
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.crud_buttons}>
          <columnsContext.Provider value={columnDefs}>
            <CrudButtons
              error={error}
              setError={setError}
              grid={gridRef}
              onAdd={(data: object) => {
                axios
                  .post("/trades", data)
                  .then((response) => {
                    console.log("Trade added successfully:", response.data);
                    setRowData((prevData: []) => [...prevData, response.data]);
                  })
                  .catch((error) => {
                    console.error(
                      "There was an error adding the trade:",
                      error
                    );
                  });
              }}
              onDelete={() => {
                const selectedRows = gridRef.current?.api.getSelectedRows();
                if (!selectedRows?.length) {
                  setError("Please select a row to delete");
                  return;
                }
                selectedRows?.forEach((row) => {
                  setRowData((prevData: []) =>
                    prevData.filter((data: any) => data._id !== row._id)
                  );
                  axios
                    .delete(`/trades/${row._id}`)
                    .then((response) => {
                      console.log("Trade deleted successfully:", response.data);
                    })
                    .catch((error) => {
                      console.error(
                        "There was an error deleting the trade:",
                        error
                      );
                    });
                });
              }}
              onEdit={(data: any) => {
                axios
                  .put(`/trades/${data._id}`, data)
                  .then((response) => {
                    console.log("Trade edited successfully:", response.data);
                    setRowData((prevData: []) =>
                      prevData.map((d: any) =>
                        d._id === response.data._id ? response.data : d
                      )
                    );
                  })
                  .catch((error) => {
                    console.error(
                      "There was an error editing the trade:",
                      error
                    );
                  });
              }}
            />
          </columnsContext.Provider>
        </div>
        {error && <AlertDestructive message={error} />}
        <div
          className="aggrid-container"
          style={{ width: "90vw", height: "500px" }}
        >
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            theme={themeMaterial}
            domLayout="autoHeight"
            animateRows={true}
            pagination={true}
            rowSelection={"multiple"}
            rowMultiSelectWithClick={true}
            paginationPageSize={5}
            gridOptions={{
              autoSizeStrategy: {
                type: "fitGridWidth",
                defaultMinWidth: 100,
                columnLimits: [
                  {
                    colId: "ticker",
                    maxWidth: 150,
                  },
                ],
              },
            }}
          />
        </div>
      </main>
    </div>
  );
}
