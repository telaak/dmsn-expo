import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import { DataTable } from "react-native-paper";
import { useSortBy, useTable } from "react-table";
import { MaterialIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

const numberOfItemsPerPageList = [1, 2, 3, 4];

export function ContactList( { navigation } ) {
  const data = React.useMemo(
    () => [
      {
        name: "Test name A",
        email: "test@test.fi",
        phoneNumber: "0449708811",
        _id: '152521521',
        messages: [
            {
                time: '3d',
                content: 'Goodbye cruel world'
            },
            {
                time: '9d',
                content: 'I lied'
            },
            {
                time: '12d',
                content: 'Or not'
            }
        ]
      },
      {
        name: "Test name B",
        email: "test@test.fi",
        phoneNumber: "0595958",
        _id: '53t5239ufas',
        messages: [
            {
                time: '3d',
                content: 'Goodbye cruel world'
            },
            {
                time: '9d',
                content: 'I lied'
            }
        ]
      },
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Phone nr.",
        accessor: "phoneNumber",
      },
    ],

    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );
  const from = page * numberOfItemsPerPage;
  const to = Math.min((page + 1) * numberOfItemsPerPage, data.length);

  React.useEffect(() => {
    setPage(0);
  }, [numberOfItemsPerPage]);

  const getIcon = (isSorted) => {
    if (typeof isSorted === "undefined") {
      return "";
    } else if (isSorted) {
      return "arrow-upward";
    } else {
      return "arrow-downward";
    }
  };

  return (
    <ScrollView>
      <DataTable {...getTableProps()}>
        {headerGroups.map((headerGroup) => (
          <DataTable.Header {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <DataTable.Title
                {...column.getHeaderProps(column.getSortByToggleProps())}
                onPress={() => column.toggleSortBy()}
              >
                {column.render("Header")}
                <MaterialIcons
                  name={getIcon(column.isSortedDesc)}
                  size={16}
                  color="black"
                />
              </DataTable.Title>
            ))}
          </DataTable.Header>
        ))}
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <Pressable key={i} onLongPress={() => {
                navigation.navigate('ContactEdit', { data: row.original })
            }}>
              <DataTable.Row {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <DataTable.Cell {...cell.getCellProps()}>
                      <Text
                      >
                        {cell.value}
                      </Text>
                    </DataTable.Cell>
                  );
                })}
              </DataTable.Row>
            </Pressable>
          );
        })}
      </DataTable>
    </ScrollView>
  );
}
