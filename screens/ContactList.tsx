import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Pressable,
  StyleSheet,
} from "react-native";
import { DataTable, FAB, TouchableRipple } from "react-native-paper";
import { useSortBy, useTable } from "react-table";
import { MaterialIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Button, Menu, Divider, Provider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { useQueryClient, useQuery } from "react-query";
import { getDeleteContactMutation, getUser, IContact } from "../api/api";
import { useNavigation } from "@react-navigation/native";

const numberOfItemsPerPageList = [1, 2, 3, 4];

export function ContactList() {
  const [testData, setTestData] = React.useState<IContact[] | never[]>([] as IContact[])

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

  const { status, data, error, isSuccess } = useQuery("user", getUser)

  const getContacts = useEffect(() => {
    if (status === 'success') {
      const contacts = data.contacts
      setTestData(contacts)
    }
  }, [status, data]);

  

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns: columns, data: testData }, useSortBy);


  const getIcon = (isSorted: boolean) => {
    if (typeof isSorted === "undefined") {
      return "";
    } else if (isSorted) {
      return "arrow-upward";
    } else {
      return "arrow-downward";
    }
  };

  const navigation = useNavigation()

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
            return <RowView row={row} key={i} />;
          })}
        </DataTable>
      </ScrollView>
      <FAB
        icon={() => <MaterialCommunityIcons name="plus" size={24} />}
        style={styles.fab}
        onPress={() => navigation.navigate('ContactEdit', { new: true })}
      />
    </View>
  );
}

const RowView = ( { row }) => {
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const [anchor, setAnchor] = React.useState({ x: 0, y: 0 });
  const navigation = useNavigation()
  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
  };

  const deleteMutation = getDeleteContactMutation()

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
              navigation.navigate("ContactEdit", {
                id: row.original._id
              });
               closeMenu();
            }}
            title="Edit"
          />
          <Menu.Item
            icon={() => <MaterialIcons name="content-copy" size={24} />}
            onPress={() => {
              copyToClipboard(JSON.stringify(row.original));
              closeMenu();
            }}
            title="Copy"
          />
          <Divider />
          <Menu.Item
            icon={() => <MaterialIcons name="delete" size={24} />}
            onPress={() => deleteMutation.mutate(row.original._id)}
            title="Delete"
          />
        </Menu>
      </View>
      <DataTable.Row {...row.getRowProps()}>
        {row.cells.map((cell, i: number) => {
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

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
