import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AddEditDialog from "./TradeDialog";
const CrudButtons: React.FC<{
  onAdd: (data: object) => void;
  onEdit: (data: object) => void;
  onDelete: () => void;
  grid: React.MutableRefObject<any>;
  error: string;
  setError: (error: string) => void;
}> = ({ onAdd, onEdit, onDelete, grid, error, setError }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  return (
    <>
      <AddEditDialog
        dialog_title="Add"
        open={openAddModal}
        setOpen={setOpenAddModal}
        onSubmit={onAdd}
      />

      <Button
        className="p-2 bg-green-500 text-white rounded"
        onClick={() => setOpenAddModal(true)}
      >
        Add{" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
        </svg>
      </Button>
      <Button
        className="mr-2 p-2 bg-red-500 text-white rounded"
        onClick={onDelete}
      >
        Delete{" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
        </svg>
      </Button>

      <AddEditDialog
        dialog_title="Edit"
        open={openEditModal}
        setOpen={setOpenEditModal}
        onSubmit={onEdit}
        fData={selectedRows[0]}
      />
      <Button
        className="p-2 bg-yellow-500 text-white rounded"
        onClick={() => {
          const rows = grid.current?.api.getSelectedRows();
          if (rows > 1) {
            setError("Please select only one row to edit");
            return;
          }
          if (rows < 1) {
            setError("Please select a row to edit");
            return;
          }
          setSelectedRows(rows);

          setOpenEditModal(true);
        }}
      >
        Edit{" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
          <path
            fillRule="evenodd"
            d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
          />
        </svg>
      </Button>
    </>
  );
};

export default CrudButtons;
