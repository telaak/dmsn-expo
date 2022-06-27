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
import { DataTable, TouchableRipple } from "react-native-paper";
import { useSortBy, useTable } from "react-table";
import { MaterialIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Button, Menu, Divider, Provider } from "react-native-paper";


const numberOfItemsPerPageList = [1, 2, 3, 4];

export function ContactList({ navigation }) {
  const data = React.useMemo(
    () => [
      {
        name: "Test name A",
        email: "test@test.fi",
        phoneNumber: "0449708811",
        _id: "152521521",
        messages: [
          {
            time: "3d",
            content: "Goodbye cruel world",
          },
          {
            time: "9d",
            content: "I lied",
          },
          {
            time: "12d",
            content: "Or not",
          },
        ],
      },
      {
        name: "Test name B",
        email: "test@test.fi",
        phoneNumber: "0595958",
        _id: "53t5239ufas",
        messages: [
          {
            time: "3d",
            content: "Goodbye cruel world",
          },
          {
            time: "9d",
            content: "I lied",
          },
        ],
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

  const getIcon = (isSorted: boolean) => {
    if (typeof isSorted === "undefined") {
      return "";
    } else if (isSorted) {
      return "arrow-upward";
    } else {
      return "arrow-downward";
    }
  };

  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  return (
    <ScrollView>
      <Menu visible={visible} onDismiss={closeMenu} anchor={<></>}>
        <Menu.Item onPress={() => {}} title="Item 1" />
        <Menu.Item onPress={() => {}} title="Item 2" />
        <Divider />
        <Menu.Item onPress={() => {}} title="Item 3" />
      </Menu>
      <DataTable>
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
          return <RowView navigation={navigation} row={row} key={i} />;
        })}
      </DataTable>
    </ScrollView>
  );
}

const RowView = ({ navigation, row }) => {
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const [anchor, setAnchor] = React.useState({ x: 0, y: 0 });

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
  };

  return (
    <Pressable
      onLongPress={(s) => {
        const anchor = {
          x: s.nativeEvent.pageX,
          y: s.nativeEvent.pageY,
        };
        setAnchor(anchor);
        openMenu();
      }}
    >
      <View>
        <Menu visible={visible} onDismiss={closeMenu} anchor={anchor}>
          <Menu.Item
            icon={() => <MaterialIcons name="edit" size={24} />}
            onPress={() => {
              navigation.navigate("ContactEdit", { data: JSON.stringify(row.original) });
              closeMenu();
            }}
            title="Edit"
          />
          <Menu.Item
            icon={() => <MaterialIcons name="content-copy" size={24} />}
            onPress={() => {
                copyToClipboard(JSON.stringify(row.original))
                closeMenu()
            }}
            title="Copy"
          />
          <Divider />
          <Menu.Item
            icon={() => <MaterialIcons name="delete" size={24} />}
            onPress={() => {}}
            title="Delete"
          />
        </Menu>
      </View>
      <DataTable.Row {...row.getRowProps()}>
        {row.cells.map((cell, i) => {
          return (
            <DataTable.Cell key={i} {...cell.getCellProps()}>
              <Text>{cell.value}</Text>
            </DataTable.Cell>
          );
        })}
      </DataTable.Row>
    </Pressable>
  );
};


