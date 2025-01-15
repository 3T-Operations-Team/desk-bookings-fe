import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import { DeskBookingConfirmed } from "../types/bookings";
import isToday from "dayjs/plugin/isToday";
import dayjs from "dayjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBooking } from "../services/api";

dayjs.extend(isToday);

interface EnhancedTableToolbarProps {
  numSelected: number;
  title: string;
  onDelete: () => void;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;
  return (
    <Toolbar>
      <Typography sx={{ flex: "1 1 100%" }} variant="h5" id="tableTitle">
        {props.title}
      </Typography>
      {numSelected > 0 && (
        <Typography
          sx={{ flex: "1 1 100%", marginRight: "30px", textAlign: "end" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      )}
      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton onClick={props.onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

const MyBookingsTable: React.FC<{
  title: string;
  allowDelete?: boolean;
  rowsData: DeskBookingConfirmed[];
}> = ({ title, allowDelete, rowsData }) => {
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const queryClient = useQueryClient();

  const deleteBookingsMutation = useMutation({
    mutationFn: () => {
      const promises: Promise<void>[] = [];
      for (const selectedBookingId of selected) {
        promises.push(deleteBooking(selectedBookingId));
      }
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["allMyBookings"],
      });
      queryClient.invalidateQueries({
        queryKey: ["allBookingsForDate"],
      });
      setSelected([]);
    },
  });

  const handleClick = (id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (_e: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = React.useMemo(
    () =>
      [...rowsData]
        .sort((d1, d2) => {
          if (dayjs(d1.bookingDate).isAfter(d2.bookingDate)) return 1;
          if (dayjs(d1.bookingDate).isBefore(d2.bookingDate)) return -1;
          return 0;
        })
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [rowsData, page, rowsPerPage],
  );

  return (
    <Box>
      <Paper>
        <EnhancedTableToolbar
          numSelected={selected.length}
          title={title}
          onDelete={deleteBookingsMutation.mutate}
        />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell component="td">Desk</TableCell>
                {allowDelete && (
                  <TableCell align="right" component="td"></TableCell>
                )}
                <TableCell align="right" component="td">
                  Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = selected.includes(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={() => handleClick(row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    {allowDelete && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                    )}
                    <TableCell
                      component="td"
                      id={labelId}
                      scope="row"
                      padding={allowDelete ? "none" : "normal"}
                    >
                      {"Flex " + row.deskNumber}
                    </TableCell>
                    <TableCell align="right">
                      {dayjs(row.bookingDate).isToday()
                        ? "today"
                        : row.bookingDate}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rowsData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default MyBookingsTable;
